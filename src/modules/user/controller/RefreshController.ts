import { Request, Response } from 'express';
import { RefreshTokenService } from '../RefreshTokenService';
import { AppError } from '../../../shared/errors/AppError';

export class RefreshController {
  private refreshService: RefreshTokenService;

  constructor() {
    this.refreshService = new RefreshTokenService();
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        return res.status(400).json({ status: 'error', message: 'Refresh token é obrigatório' });
      }
      const tokens = await this.refreshService.execute(refresh_token);
      return res.status(200).json({ status: 'success', data: tokens });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ status: 'error', message: error.message });
      }
      console.error('Refresh error:', error);
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor' });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const { refresh_token } = req.body;
      if (refresh_token) {
        await this.refreshService.revoke(refresh_token);
      }
      return res.status(204).send();
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor' });
    }
  }
}
