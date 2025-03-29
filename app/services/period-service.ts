import BaseService from './base-service';
import type { AxiosResponse } from 'axios';

// Define the Period interface
export interface Period {
  id: string;
  year: number;
  month: number;
  createdAt: string;
  updatedAt: string;
}

// Define response interfaces
interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export default class PeriodService extends BaseService {
  /**
   * Get all periods for the current user
   * @returns Promise with all periods
   */
  getAll = (): Promise<Period[]> => {
    return this._axios.get<ApiResponse<Period[]>>("periods")
      .then(response => response.data.data);
  }

  /**
   * Get a specific period by ID
   * @param id The period ID
   * @returns Promise with the period data
   */
  getById = (id: string): Promise<Period> => {
    return this._axios.get<ApiResponse<Period>>(`periods/${id}`)
      .then(response => response.data.data);
  }

  /**
   * Create a new period
   * @param periodData The period data to create
   * @returns Promise with the created period
   */
  create = (periodData: { year: number; month: number }): Promise<Period> => {
    return this._axios.post<ApiResponse<Period>>("periods", periodData)
      .then(response => response.data.data);
  }

  /**
   * Update an existing period
   * @param id The period ID to update
   * @param periodData The updated period data
   * @returns Promise with the updated period
   */
  update = (id: string, periodData: { year: number; month: number }): Promise<Period> => {
    return this._axios.patch<ApiResponse<Period>>(`periods/${id}`, periodData)
      .then(response => response.data.data);
  }

  /**
   * Delete a period
   * @param id The period ID to delete
   * @returns Promise with the delete response
   */
  delete = (id: string): Promise<void> => {
    return this._axios.delete<ApiResponse<null>>(`periods/${id}`)
      .then(() => undefined);
  }
}