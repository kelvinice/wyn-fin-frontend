import BaseService from './base-service';
import type { Spending, CreateSpendingDto, UpdateSpendingDto, ApiResponse } from '~/models/spending';

export default class SpendingService extends BaseService {
  /**
   * Get all spendings for the current user
   */
  getAll = (): Promise<Spending[]> => {
    return this._axios.get<ApiResponse<Spending[]>>("spendings")
      .then(response => response.data.data);
  }

  /**
   * Get all spendings for a specific period
   */
  getByPeriod = (periodId: string): Promise<Spending[]> => {
    return this._axios.get<ApiResponse<Spending[]>>(`spendings?periodId=${periodId}`)
      .then(response => response.data.data);
  }

  /**
   * Get a specific spending by ID
   */
  getById = (id: string): Promise<Spending> => {
    return this._axios.get<ApiResponse<Spending>>(`spendings/${id}`)
      .then(response => response.data.data);
  }

  /**
   * Create a new spending
   */
  create = (spendingData: CreateSpendingDto): Promise<Spending> => {
    return this._axios.post<ApiResponse<Spending>>("spendings", spendingData)
      .then(response => response.data.data);
  }

  /**
   * Update an existing spending
   */
  update = (id: string, spendingData: UpdateSpendingDto): Promise<Spending> => {
    return this._axios.patch<ApiResponse<Spending>>(`spendings/${id}`, spendingData)
      .then(response => response.data.data);
  }

  /**
   * Delete a spending
   */
  delete = (id: string): Promise<void> => {
    return this._axios.delete<ApiResponse<void>>(`spendings/${id}`)
      .then(() => undefined);
  }
}