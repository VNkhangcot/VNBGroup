import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { MotionValue } from 'framer-motion';

interface Scene3DProps {
  scrollProgress?: number; // 0 to 1
  scrollYProgress?: MotionValue<number>;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShaderSource = `
  #define STEP 0.075
  #define NSTEPS 280
  #define PI 3.141592653589793238462643383279
  #define DEG_TO_RAD (PI/180.0)
  #define ROT_Y(a) mat3(1, 0, 0, 0, cos(a), sin(a), 0, -sin(a), cos(a))
  #define ROT_Z(a) mat3(cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1)

  uniform float time;
  uniform vec2 resolution;

  uniform vec3 cam_pos;
  uniform vec3 cam_dir;
  uniform vec3 cam_up;
  uniform float fov;
  uniform vec3 cam_vel;

  const float MIN_TEMPERATURE = 1000.0;
  const float TEMPERATURE_RANGE = 39000.0;

  uniform bool accretion_disk;
  uniform bool use_disk_texture;
  const float DISK_IN = 2.0;
  const float DISK_WIDTH = 4.2;

  uniform bool doppler_shift;
  uniform bool lorentz_transform;
  uniform bool beaming;

  uniform sampler2D disk_texture;

  vec2 square_frame(vec2 screen_size){
    vec2 position = 2.0 * (gl_FragCoord.xy / screen_size.xy) - 1.0; 
    return position;
  }

  // Procedural Starfield Hash
  float hash21(vec2 p, float f) {
    p = fract(p * vec2(123.34, 456.21) + f * 789.12);
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  vec2 hash22(vec2 p, float f) {
    float h1 = hash21(p, f);
    float h2 = hash21(p + 31.41, f + 17.73);
    return vec2(h1, h2);
  }

  // Procedural 3D Cubemap Stars (Seamless, zero distortion, multi-magnitude)
  vec3 get_procedural_stars(vec3 rd, float time_val) {
    vec3 a = abs(rd);
    vec2 st;
    float face;

    if (a.z >= a.x && a.z >= a.y) {
      st = rd.xy / a.z;
      face = rd.z > 0.0 ? 1.0 : 2.0;
    } else if (a.x > a.z && a.x >= a.y) {
      st = rd.yz / a.x;
      face = rd.x > 0.0 ? 3.0 : 4.0;
    } else {
      st = rd.xz / a.y;
      face = rd.y > 0.0 ? 5.0 : 6.0;
    }

    vec3 col = vec3(0.0);

    // LAYER 1: Deep cosmic micro-pinpoints (subtle, crisp, faint background field)
    {
      float scale1 = 320.0;
      vec2 uv1 = st * scale1;
      vec2 id1 = floor(uv1);
      vec2 gv1 = fract(uv1) - 0.5;

      float h1 = hash21(id1, face);
      if (h1 > 0.86) {
        vec2 off1 = (hash22(id1 + 11.1, face) - 0.5) * 0.75;
        float d1 = length(gv1 - off1);
        float b1 = pow(clamp(1.0 - d1 / 0.14, 0.0, 1.0), 5.0) * (h1 - 0.86) * 7.0 * 0.65;
        col += vec3(0.85, 0.90, 1.0) * b1;
      }
    }

    // LAYER 2: Medium magnitude stars (diverse stellar temperatures, crisp diamond points)
    {
      float scale2 = 120.0;
      vec2 uv2 = st * scale2;
      vec2 id2 = floor(uv2);
      vec2 gv2 = fract(uv2) - 0.5;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 neighbor = vec2(float(dx), float(dy));
          vec2 cell = id2 + neighbor;
          float h2 = hash21(cell, face);

          if (h2 > 0.935) {
            vec2 rnd = hash22(cell + 55.5, face);
            vec2 pos = neighbor + (rnd - 0.5) * 0.75;
            float d2 = length(gv2 - pos);

            float size = fract(h2 * 43.12);
            float radius = 0.025 + 0.035 * size;
            float core = pow(clamp(1.0 - d2 / radius, 0.0, 1.0), 4.0) * 1.4;
            float halo = pow(clamp(1.0 - d2 / (radius * 2.5), 0.0, 1.0), 2.5) * 0.14;

            float twinkle = 0.88 + 0.12 * sin(time_val * (1.8 + size * 2.2) + h2 * 62.8);

            vec3 star_color = vec3(1.0);
            if (size > 0.75) {
              star_color = vec3(0.80, 0.90, 1.0); // O/B blue-white
            } else if (size > 0.45) {
              star_color = vec3(0.98, 0.98, 1.0); // A/F crisp white
            } else if (size > 0.20) {
              star_color = vec3(1.0, 0.88, 0.70); // G/K warm gold
            } else {
              star_color = vec3(1.0, 0.68, 0.48); // M orange dwarf
            }

            col += (core + halo) * star_color * twinkle * (0.6 + 0.6 * size);
          }
        }
      }
    }

    // LAYER 3: Rare prominent stars with needle-thin diffraction spikes (Hubble/JWST style)
    {
      float scale3 = 36.0;
      vec2 uv3 = st * scale3;
      vec2 id3 = floor(uv3);
      vec2 gv3 = fract(uv3) - 0.5;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 neighbor = vec2(float(dx), float(dy));
          vec2 cell = id3 + neighbor;
          float h3 = hash21(cell, face);

          if (h3 > 0.976) {
            vec2 rnd = hash22(cell + 12.3, face);
            vec2 pos = neighbor + (rnd - 0.5) * 0.65;
            vec2 diff = gv3 - pos;
            float d3 = length(diff);

            float flare = (h3 - 0.976) / 0.024;
            float core = pow(clamp(1.0 - d3 / 0.035, 0.0, 1.0), 4.0) * 2.0;
            float halo = pow(clamp(1.0 - d3 / 0.12, 0.0, 1.0), 2.5) * 0.22;

            // Needle-thin diffraction spikes
            float spike_len = 0.38;
            float spike_width = 80.0;
            float spike_x = clamp(1.0 - abs(diff.x) * spike_width, 0.0, 1.0) * pow(clamp(1.0 - abs(diff.y) / spike_len, 0.0, 1.0), 3.0);
            float spike_y = clamp(1.0 - abs(diff.y) * spike_width, 0.0, 1.0) * pow(clamp(1.0 - abs(diff.x) / spike_len, 0.0, 1.0), 3.0);
            float spikes = (spike_x + spike_y) * 0.50;

            float twinkle = 0.88 + 0.12 * sin(time_val * 2.5 + h3 * 37.0);
            vec3 flare_color = mix(vec3(0.85, 0.92, 1.0), vec3(1.0, 0.82, 0.60), fract(h3 * 17.3));

            col += (core + halo + spikes) * flare_color * (0.8 + 0.8 * flare) * twinkle;
          }
        }
      }
    }

    return col;
  }

  vec3 lorentz_transform_velocity(vec3 u, vec3 v){ 
    float speed = length(v);
    if (speed > 0.0){
      float gamma = 1.0/sqrt(max(0.0001, 1.0 - dot(v,v)));
      float denominator = 1.0 - dot(v,u);
      vec3 new_u = (u/gamma - v + (gamma/(gamma+1.0)) * dot(u,v)*v)/max(0.0001, denominator);
      return new_u;
    }
    return u;
  }

  vec3 temp_to_color(float temp_kelvin){
    vec3 color;
    temp_kelvin = clamp(temp_kelvin, 1000.0, 40000.0) / 100.0;
    if (temp_kelvin <= 66.0){
      color.r = 255.0;
      color.g = temp_kelvin;
      color.g = 99.4708025861 * log(max(0.001, color.g)) - 161.1195681661;
      if (color.g < 0.0) color.g = 0.0;
      if (color.g > 255.0) color.g = 255.0;
    } else {
      color.r = temp_kelvin - 60.0;
      if (color.r < 0.0) color.r = 0.0;
      color.r = 329.698727446 * pow(max(0.001, color.r), -0.1332047592);
      if (color.r < 0.0) color.r = 0.0;
      if (color.r > 255.0) color.r = 255.0;
      color.g = temp_kelvin - 60.0;
      if (color.g < 0.0) color.g = 0.0;
      color.g = 288.1221695283 * pow(max(0.001, color.g), -0.0755148492);
      if (color.g > 255.0) color.g = 255.0;  
    }
    if (temp_kelvin >= 66.0){
      color.b = 255.0;
    } else if (temp_kelvin <= 19.0){
      color.b = 0.0;
    } else {
      color.b = temp_kelvin - 10.0;
      color.b = 138.5177312231 * log(max(0.001, color.b)) - 305.0447927307;
      if (color.b < 0.0) color.b = 0.0;
      if (color.b > 255.0) color.b = 255.0;
    }
    color /= 255.0;
    return color;
  }

  void main() {
    float uvfov = tan(fov / 2.0 * DEG_TO_RAD);
    vec2 uv = square_frame(resolution); 
    uv *= vec2(resolution.x/resolution.y, 1.0);

    vec3 forward = normalize(cam_dir);
    vec3 up = normalize(cam_up);
    vec3 nright = normalize(cross(forward, up));
    up = cross(nright, forward);

    vec3 pixel_pos = cam_pos + forward + nright*uv.x*uvfov + up*uv.y*uvfov;
    vec3 ray_dir = normalize(pixel_pos - cam_pos);

    if (lorentz_transform)
      ray_dir = lorentz_transform_velocity(ray_dir, cam_vel);

    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

    vec3 point = cam_pos;
    vec3 velocity = ray_dir;
    vec3 c = cross(point, velocity);
    float h2 = dot(c, c);

    float ray_gamma = 1.0/sqrt(max(0.0001, 1.0 - dot(cam_vel, cam_vel)));
    float ray_doppler_factor = ray_gamma * (1.0 + dot(ray_dir, -cam_vel));
    float ray_intensity = 1.0;
    if (beaming)
      ray_intensity /= pow(max(0.001, ray_doppler_factor), 3.0);

    vec3 oldpoint;
    float distance = length(point);

    for (int i = 0; i < NSTEPS; i++) {
      oldpoint = point;
      point += velocity * STEP;
      vec3 accel = -1.5 * h2 * point / pow(dot(point, point), 2.5);
      velocity += accel * STEP;

      distance = length(point);
      if (distance < 0.0) break;

      bool horizon_mask = distance < 1.0;
      if (horizon_mask) {
        break;
      }

      // Early escape when ray is moving away in outer space
      if (distance > 15.0 && dot(point, velocity) > 0.0) {
        break;
      }

      if (accretion_disk) {
        if (oldpoint.y * point.y < 0.0) {
          float lambda = -oldpoint.y / velocity.y;
          vec3 intersection = oldpoint + lambda * velocity;
          float r = length(intersection);

          if (DISK_IN <= r && r <= DISK_IN + DISK_WIDTH) {
            float phi = atan(intersection.x, intersection.z);
            vec3 disk_velocity = vec3(-intersection.x, 0.0, intersection.z) / (sqrt(max(0.001, 2.0 * (r - 1.0))) * (r * r));
            phi -= time;
            phi = mod(phi, PI * 2.0);

            float disk_gamma = 1.0 / sqrt(max(0.0001, 1.0 - dot(disk_velocity, disk_velocity)));
            float disk_doppler_factor = disk_gamma * (1.0 + dot(ray_dir / max(0.001, distance), disk_velocity));

            if (use_disk_texture) {
              vec2 tex_coord = vec2(mod(phi, 2.0 * PI) / (2.0 * PI), 1.0 - (r - DISK_IN) / DISK_WIDTH);
              vec4 disk_color = texture2D(disk_texture, tex_coord) / (max(0.001, ray_doppler_factor) * max(0.001, disk_doppler_factor));
              float disk_alpha = clamp(dot(disk_color, disk_color) / 4.5, 0.0, 1.0);

              if (beaming)
                disk_alpha /= pow(max(0.001, disk_doppler_factor), 3.0);

              color += vec4(disk_color.rgb, 1.0) * disk_alpha;
            } else {
              // Physical blackbody temperature (Shakura-Sunyaev thin accretion disk T ~ r^-3/4)
              float disk_temperature = 10000.0 * pow(r / DISK_IN, -3.0 / 4.0);
              if (doppler_shift)
                disk_temperature /= (max(0.001, ray_doppler_factor) * max(0.001, disk_doppler_factor));

              // Physical incandescent core color (intense radiant white flare)
              vec3 physical_white = temp_to_color(disk_temperature);

              // Radial coordinate across disk: 0.0 (inner r=2.0) to 1.0 (outer r=6.2)
              float norm_r = clamp((r - DISK_IN) / DISK_WIDTH, 0.0, 1.0);

              // 1. White inside, transitioning to warm gold and brand orange towards outer rim
              vec3 brand_orange = vec3(1.0, 0.40, 0.02);
              vec3 disk_base = physical_white;
              disk_base = mix(disk_base, vec3(1.0, 0.82, 0.45), smoothstep(0.55, 0.75, norm_r));
              disk_base = mix(disk_base, brand_orange, smoothstep(0.75, 0.90, norm_r));

              // 2. 1 Distinct outer orange ring with running energy streamers (Cam 1 vòng ngoài viền)
              float outer_ring = exp(-pow((r - 5.65) / 0.11, 2.0));
              float ring_speed = time * 1.8;
              float stream = pow(0.5 + 0.5 * sin(phi * 8.0 - ring_speed), 4.0) * 1.8;
              vec3 orange_rim = brand_orange * (outer_ring * 2.0 + outer_ring * stream * 2.5);

              // 3. Smooth physical edge transitions
              float inner_fade = smoothstep(DISK_IN, DISK_IN + 0.35, r);
              float outer_fade = smoothstep(DISK_IN + DISK_WIDTH, DISK_IN + DISK_WIDTH - 0.70, r);
              float radial_mask = inner_fade * outer_fade;

              // 4. Keplerian differential plasma streaks (original glorious flow)
              float streak_speed = time * 0.85;
              float streaks = 0.82 + 0.16 * sin(phi * 4.0 + r * 5.0 - streak_speed)
                                  + 0.10 * sin(phi * 10.0 - r * 8.5 + streak_speed * 1.3)
                                  + 0.06 * cos(phi * 22.0 + r * 15.0);

              vec3 disk_color = disk_base + orange_rim;

              // Full radiant flare alpha
              float disk_alpha = clamp(dot(disk_base, disk_base) / 2.8, 0.0, 1.0) * radial_mask * streaks + outer_ring * 0.45 * radial_mask;
              disk_alpha = clamp(disk_alpha, 0.0, 1.0);

              if (beaming)
                disk_alpha /= pow(max(0.001, disk_doppler_factor), 3.0);

              color += vec4(disk_color, 1.0) * disk_alpha;
            }
          }
        }
      }
    }

    if (distance > 1.0) {
      ray_dir = normalize(point - oldpoint);
      vec3 star_color = get_procedural_stars(ray_dir, time);

      if (doppler_shift) {
        star_color /= max(0.001, ray_doppler_factor);
      }

      color += vec4(star_color, 1.0);
    }

    gl_FragColor = color * ray_intensity;
  }
`;

export const Scene3D: React.FC<Scene3DProps> = ({ scrollProgress = 0, scrollYProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<number>(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setClearColor(0x020202, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);

    // 2. Scene & Orthographic 2D Camera
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;

    // 3. Post-Processing: Default Repo UnrealBloomPass (strength 0.9, radius 0.5, threshold 0.65)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(128, 128),
      0.92,  // Full radiant bloom flare strength
      0.48,  // Broad cinematic lens flare halo
      0.65   // Clean threshold so background space stays crisp while accretion disk flares
    );
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    // 4. Procedural Accretion Disk (Pure Physical Kelvin Blackbody Simulation)
    // 1x1 fallback texture to satisfy Three.js uniform without loading external image files
    const diskTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    diskTexture.needsUpdate = true;

    // 5. Shader Uniforms
    const uniforms = {
      time: { value: 0.0 },
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      accretion_disk: { value: true },
      use_disk_texture: { value: false },
      lorentz_transform: { value: true },
      doppler_shift: { value: true },
      beaming: { value: true },
      cam_pos: { value: new THREE.Vector3(0, 0, 10.0) },
      cam_vel: { value: new THREE.Vector3(0, 0, 0) },
      cam_dir: { value: new THREE.Vector3(0, 0, -1) },
      cam_up: { value: new THREE.Vector3(0, 1, 0) },
      fov: { value: 75.0 },
      disk_texture: { value: diskTexture },
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fragmentShaderSource,
      uniforms,
      depthWrite: false,
    });

    const projectionMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
    scene.add(projectionMesh);

    // 6. Camera & Observer State (Matching original repo defaults)
    // Distance: 10.5, Incline: -5 deg, FOV: 70 deg
    const observer = {
      r: 10.5,
      incline: -5.0 * (Math.PI / 180),
      theta: 0.0,
      pitch: 0.0,
      yaw: 0.0,
      angularVelocity: 0.02,
      velocity: new THREE.Vector3(),
    };

    // 7. Mouse Interaction (Gentle Parallax)
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 8. Responsive Resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
      composer.setSize(window.innerWidth, window.innerHeight);
      uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // 9. Animation & Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentScroll = scrollYProgress ? scrollYProgress.get() : scrollRef.current;
    let orbitalTheta = 0.0;
    let orbitalYaw = 0.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Scroll interpolation
      const targetScroll = scrollYProgress ? scrollYProgress.get() : scrollRef.current;
      currentScroll += (targetScroll - currentScroll) * 0.065;

      // Camera distance and subtle tilt based on scroll
      // Hero (0.0): Distance 10.5, clean centered majestic view
      // Services (0.25): Distance 9.5
      // Tech Matrix (0.55): Distance 8.5
      // Stats (0.8): Distance 9.5
      // Contact (1.0): Distance 11.0
      // Framing the celestial black hole majestically between 11.5 and 10.2
      let targetR = 11.5;
      let targetIncline = -5.0 * (Math.PI / 180);
      let targetPitch = 0.0;
      let targetYawOffset = 0.0;

      if (currentScroll < 0.25) {
        const t = currentScroll / 0.25;
        targetR = THREE.MathUtils.lerp(11.5, 10.8, t);
        targetIncline = THREE.MathUtils.lerp(-5.0, -7.0, t) * (Math.PI / 180);
        targetYawOffset = THREE.MathUtils.lerp(0.0, 0.12, t);
      } else if (currentScroll < 0.55) {
        const t = (currentScroll - 0.25) / 0.30;
        targetR = THREE.MathUtils.lerp(10.8, 10.2, t);
        targetIncline = THREE.MathUtils.lerp(-7.0, -9.0, t) * (Math.PI / 180);
        targetYawOffset = THREE.MathUtils.lerp(0.12, 0.18, t);
        targetPitch = THREE.MathUtils.lerp(0.0, 0.02, t);
      } else if (currentScroll < 0.8) {
        const t = (currentScroll - 0.55) / 0.25;
        targetR = THREE.MathUtils.lerp(10.2, 10.8, t);
        targetIncline = THREE.MathUtils.lerp(-9.0, -6.0, t) * (Math.PI / 180);
        targetYawOffset = THREE.MathUtils.lerp(0.18, -0.08, t);
        targetPitch = THREE.MathUtils.lerp(0.02, -0.01, t);
      } else {
        const t = (currentScroll - 0.8) / 0.2;
        targetR = THREE.MathUtils.lerp(10.8, 11.8, t);
        targetIncline = THREE.MathUtils.lerp(-6.0, -5.0, t) * (Math.PI / 180);
        targetYawOffset = THREE.MathUtils.lerp(-0.08, 0.0, t);
        targetPitch = THREE.MathUtils.lerp(-0.01, 0.0, t);
      }

      // Authentic Keplerian orbital motion from repo (gentle continuous drift)
      const maxAngularVelocity = 1.0 / (Math.sqrt(Math.max(0.1, 2.0 * (targetR - 1.0))) * targetR);
      const angularVel = maxAngularVelocity * 0.18;
      orbitalTheta += angularVel * delta;
      orbitalYaw += angularVel * delta;

      observer.r = targetR;
      observer.incline = targetIncline + currentMouseY * 0.04;
      observer.pitch = targetPitch - currentMouseY * 0.05;
      observer.yaw = orbitalYaw + targetYawOffset + currentMouseX * 0.08;

      // Spherical to Cartesian Coordinates for Camera Position (Exact Observer.js formula)
      const cosTheta = Math.cos(orbitalTheta);
      const sinTheta = Math.sin(orbitalTheta);
      const pos = new THREE.Vector3(observer.r * sinTheta, 0, observer.r * cosTheta);

      // Relativistic orbital velocity vector
      const vel = new THREE.Vector3(cosTheta * angularVel, 0, -sinTheta * angularVel);

      // Apply Incline Rotation around X (Exact Observer.js inclineMatrix)
      const inclineMatX = new THREE.Matrix4().makeRotationX(observer.incline);
      pos.applyMatrix4(inclineMatX);
      vel.applyMatrix4(inclineMatX);

      // Camera Orientation (Exact CameraDragControls.js direction logic)
      const dirEuler = new THREE.Euler(observer.pitch, observer.yaw, 0, 'YXZ');
      const dir = new THREE.Vector3(0, 0, -1).applyEuler(dirEuler).normalize();

      // Up vector with incline tilt (Exact CameraDragControls.js up rotation)
      const inclineMatZ = new THREE.Matrix4().makeRotationZ(observer.incline);
      const up = new THREE.Vector3(0, 1, 0).applyMatrix4(inclineMatZ).normalize();

      // Update Shader Uniforms
      uniforms.time.value += delta;
      uniforms.cam_pos.value.copy(pos);
      uniforms.cam_vel.value.copy(vel);
      uniforms.cam_dir.value.copy(dir);
      uniforms.cam_up.value.copy(up);
      uniforms.fov.value = 75.0;

      // Render through Bloom Composer
      composer.render();
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      diskTexture.dispose();
      shaderMaterial.dispose();
      projectionMesh.geometry.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ willChange: 'transform' }}
    />
  );
};

export default Scene3D;
