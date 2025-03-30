import BaseService from './base-service';
import type { Classification, CreateClassificationDto, UpdateClassificationDto, ApiResponse } from '~/models/classification';

export default class ClassificationService extends BaseService {
  /**
   * Get all classifications for the current user
   * @returns Promise with all classifications
   */
  getAll = (): Promise<Classification[]> => {
    return this._axios.get<ApiResponse<Classification[]>>('classifications')
      .then(response => response.data.data);
  }

  /**
   * Get a classification by ID
   * @param id The classification ID
   * @returns Promise with the classification
   */
  getById = (id: string): Promise<Classification> => {
    return this._axios.get<ApiResponse<Classification>>(`classifications/${id}`)
      .then(response => response.data.data);
  }

  /**
   * Create a new classification
   * @param data The classification data
   * @returns Promise with the created classification
   */
  create = (data: CreateClassificationDto): Promise<Classification> => {
    return this._axios.post<ApiResponse<Classification>>('classifications', data)
      .then(response => response.data.data);
  }

  /**
   * Update a classification
   * @param id The classification ID
   * @param data The updated classification data
   * @returns Promise with the updated classification
   */
  update = (id: string, data: UpdateClassificationDto): Promise<Classification> => {
    return this._axios.patch<ApiResponse<Classification>>(`classifications/${id}`, data)
      .then(response => response.data.data);
  }

  /**
   * Delete a classification
   * @param id The classification ID to delete
   */
  delete = (id: string): Promise<void> => {
    return this._axios.delete<ApiResponse<void>>(`classifications/${id}`)
      .then(() => undefined);
  }
}