import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, IUser, UserRole } from '../modules/auth/user.model.js';
import { TenantModel } from '../modules/tenant/tenant.model.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'vnb_super_secret_jwt_key_2026_enterprise';

export interface AuthJwtPayload {
  userId: string;
  username: string;
  fullName: string;
  role: UserRole;
  tenantId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  authPayload?: AuthJwtPayload;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Yêu cầu đăng nhập để truy cập tài nguyên này (Missing Token)',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthJwtPayload;

    const user = await UserModel.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị tạm ngưng',
      });
      return;
    }

    // If user belongs to a store (not superadmin), check whether tenant is suspended
    if (user.role !== 'superadmin' && user.tenantId) {
      const tenant = await TenantModel.findById(user.tenantId).lean();
      if (!tenant || tenant.subscription?.status === 'suspended') {
        res.status(403).json({
          success: false,
          isSuspended: true,
          message:
            'Cửa hàng/Doanh nghiệp của bạn đang bị TẠM KHÓA bởi Ban Quản Trị VNB Group. Vui lòng liên hệ Hotline: 1900 8888 hoặc Ban Giám Đốc để mở lại!',
        });
        return;
      }
    }

    req.user = user;
    req.authPayload = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ',
      error: err.message,
    });
  }
};

export const requireRoles = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Yêu cầu xác thực tài khoản',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Bạn không có quyền thực hiện thao tác này. Yêu cầu quyền: [${allowedRoles.join(
          ', '
        )}]`,
      });
      return;
    }

    next();
  };
};
