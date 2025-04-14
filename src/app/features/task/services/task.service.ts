import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Task } from '../model/task.model';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TaskService {

	private readonly _httpClient: HttpClient = inject(HttpClient);

	private readonly _apiUrl = environment.apiUrl;

	public tasks: WritableSignal<Task[]> = signal<Task[]>([]);

	public numberOfTasks: Signal<number> = computed(() => this.tasks().length);

	public getTasks(): Observable<Task[]> {
		return this._httpClient.get<Task[]>(`${this._apiUrl}/tasks`).pipe(
			tap((tasks: Task[]) => {
				let sortedTasks: Task[] = this.getSortedTasks(tasks);
				this.tasks.set(sortedTasks);
			})
		);
	}

	public createTask(task: Partial<Task>): Observable<Task> {
		return this._httpClient.
			post<Task>(`${this._apiUrl}/tasks`, task)
			.pipe(tap((newTask: Task) => this.insertATaskInTheTasksLists(newTask)));
	}

	public insertATaskInTheTasksLists(newTask: Task): void {
		const updateAndSortedTasks: Task[] = this.getSortedTasks([...this.tasks(), newTask]);
		this.tasks.set(updateAndSortedTasks);
	}

	public editTask(updatedTask: Task): Observable<Task> {
		return this._httpClient.
		put<Task>(`${this._apiUrl}/tasks/${updatedTask.id}`, updatedTask)
		.pipe(tap((task: Task) => this.updateATaskInTheTasksLists(task)));
	}

	public updateATaskInTheTasksLists(updatedTask: Task): void {
		this.tasks.update((tasks: Task[]) => {
			const allTasksWithUpdatedRemoved = tasks.filter(task => task.id !== updatedTask.id);
			
			const updatedTaskList = [...allTasksWithUpdatedRemoved, updatedTask];
			return this.getSortedTasks(updatedTaskList);
		});
	}

	public updateIsCompletedStatusTask(taskId: string, isCompleted: boolean): Observable<Task>{
		return this._httpClient.patch<Task>(`${this._apiUrl}/tasks/${taskId}`, {
			isCompleted
		})
		.pipe(tap((task: Task) => this.updateATaskInTheTasksLists(task)));
	}

	public deleteTask(taskId: string): Observable<Task> {
        return this._httpClient.delete<Task>(`${this._apiUrl}/tasks/${taskId}`)
		.pipe(tap(() => this.deleteATaskInTheTaskList(taskId)));
    }

	public deleteATaskInTheTaskList(taskId: string): void {
		this.tasks.update((tasks: Task[]) => tasks.filter(task => task.id !== taskId));
	}

	public getSortedTasks(tasks: Task[]): Task[] {
		return tasks.sort((a, b) => a.title?.localeCompare(b.title));
	}

}
