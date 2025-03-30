import BaseService from './base-service';
import type { Budget, CreateBudgetDto, UpdateBudgetDto, ApiResponse } from '~/models/budget';

export default class BudgetService extends BaseService {
  /**
   * Get all budgets for the current user
   * @returns Promise with all budgets
   */
  getAll = (): Promise<Budget[]> => {
    return this._axios.get<ApiResponse<Budget[]>>("budgets")
      .then(response => response.data.data);
  }

  /**
   * Get all budgets for a specific period
   * @param periodId The period ID to filter budgets by
   * @returns Promise with budgets for the period
   */
  getByPeriod = (periodId: string): Promise<Budget[]> => {
    return this._axios.get<ApiResponse<Budget[]>>(`budgets?periodId=${periodId}`)
      .then(response => response.data.data);
  }

  /**
   * Get a specific budget by ID
   * @param id The budget ID
   * @returns Promise with the budget data
   */
  getById = (id: string): Promise<Budget> => {
    return this._axios.get<ApiResponse<Budget>>(`budgets/${id}`)
      .then(response => response.data.data);
  }

  /**
   * Create a new budget
   * @param budgetData The budget data to create
   * @returns Promise with the created budget
   */
  create = (budgetData: CreateBudgetDto): Promise<Budget> => {
    return this._axios.post<ApiResponse<Budget>>("budgets", budgetData)
      .then(response => response.data.data);
  }

  /**
   * Update an existing budget
   * @param id The budget ID to update
   * @param budgetData The budget data to update
   * @returns Promise with the updated budget
   */
  update = (id: string, budgetData: UpdateBudgetDto): Promise<Budget> => {
    return this._axios.patch<ApiResponse<Budget>>(`budgets/${id}`, budgetData)
      .then(response => response.data.data);
  }

  /**
   * Delete a budget
   * @param id The budget ID to delete
   * @returns Promise with the deleted budget
   */
  delete = (id: string): Promise<void> => {
    return this._axios.delete<ApiResponse<void>>(`budgets/${id}`)
      .then(() => undefined);
  }
}