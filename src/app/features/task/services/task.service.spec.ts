import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing"
import { TestBed, waitForAsync } from "@angular/core/testing";
import { TaskService } from "./task.service";
import { Task } from "../model/task.model";
import { task, TASK_INTERNAL_SERVER_ERROR_RESPONSE, TASK_UNPROCESSIBLE_ENTITY_RESPONSE, tasks } from "../../../mock/task";



describe('TaskService', () => {

	let taskService: TaskService;
	let httpTestingController: HttpTestingController;

	const MOCKED_TASKS: Task[] = tasks;
	const MOCKED_TASK: Task = task;
	const BASE_URL: string = 'http://localhost:3000';

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideHttpClient(), provideHttpClientTesting()]
		});

		taskService = TestBed.inject(TaskService);
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('Create service', () => {
		expect(taskService).toBeTruthy();
	});

	it('getSortedTasks', () => {
		const sortedTasks = taskService.getSortedTasks(tasks);
		expect(sortedTasks[0].title).toEqual('Comprar pão na padaria');
	});

	describe('getTasks', () => {
		it('Should return a list of tasks', waitForAsync(() => {
			taskService.getTasks().subscribe(res => {
				expect(res).toEqual(MOCKED_TASKS);
				expect(taskService.tasks()).toEqual(MOCKED_TASKS);
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks`);

			req.flush(MOCKED_TASKS);

			expect(req.request.method).toEqual("GET");
		}));

		it('Should throw error when server returns internal server error', waitForAsync(() => {
			let httpErrorResponse: HttpErrorResponse | undefined;

			taskService.getTasks().subscribe({
				next: () => {
					fail('Failed to fetch tasks list');
				},
				error: (error: HttpErrorResponse) => {
					httpErrorResponse = error;
				}
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks`);

			req.flush('Internal Server Error', TASK_INTERNAL_SERVER_ERROR_RESPONSE);

			if (!httpErrorResponse) {
				throw new Error('Error response is undefined');
			}

			expect(httpErrorResponse.status).toEqual(500);
			expect(httpErrorResponse.statusText).toEqual('Internal Server Error');
		}));
	});

	describe('createTask', () => {
		it('Should create a new task', () => {
			let task: Task | undefined;

			taskService.createTask(MOCKED_TASK).subscribe((res) => {
				task = res;
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks`);

			req.flush(MOCKED_TASK);

			expect(task).toEqual(MOCKED_TASK);
			expect(taskService.tasks()[0]).toEqual(MOCKED_TASK);
			expect(taskService.tasks().length).toEqual(1);
			expect(req.request.method).toEqual("POST");
		});

		it('Should throw unprocessable entity with invalid body when create a task', waitForAsync(() => {
			let httpErrorResponse: HttpErrorResponse | undefined;

			taskService.createTask(MOCKED_TASK).subscribe({
				next: () => {
					fail('Failed to create a task');
				},
				error: (error: HttpErrorResponse) => {
					httpErrorResponse = error;
				}
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks`);

			req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);
		}));
	});

	describe('editTask', () => {
		it('Should update a task', waitForAsync(() => {
			const updatedTask: Task = MOCKED_TASK;
			updatedTask.title = 'Ir na academia treinar perna';

			taskService.tasks.set([MOCKED_TASK]);

			taskService.editTask(MOCKED_TASK).subscribe(() => {
				expect(taskService.tasks()[0].title).toEqual(updatedTask.title);
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks/${updatedTask.id}`);

			req.flush(MOCKED_TASK);

			expect(req.request.method).toEqual("PUT");
		}));

		it('Should throw unprocessable entity with invalid body when update a task', waitForAsync(() => {
			let httpErrorResponse: HttpErrorResponse | undefined;
			const updatedTask: Task = MOCKED_TASK;
			updatedTask.title = 'Ir na academia treinar perna';

			taskService.tasks.set([MOCKED_TASK]);

			taskService.editTask(MOCKED_TASK).subscribe({
				next: () => {
					fail('Failed to update a task');
				},
				error: (error: HttpErrorResponse) => {
					httpErrorResponse = error;
				}
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks/${updatedTask.id}`);

			req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);
		}));

		it('Should update a completed status from a task', waitForAsync(() => {
			taskService.tasks.set(MOCKED_TASKS);

			const updatedTask: Task = MOCKED_TASKS[0];

			taskService.updateIsCompletedStatusTask(updatedTask.id, true).subscribe(() => {
				expect(taskService.tasks()[0].isCompleted).toBeTruthy();
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks/${updatedTask.id}`);

			req.flush({
				isCompleted: true,
			});

			expect(req.request.method).toEqual("PATCH");
		}));

		it('Should throw unprocessable entity with invalid body when update a task isCompleted status', waitForAsync(() => {
			let httpErrorResponse: HttpErrorResponse | undefined;
			const updatedTask: Task = MOCKED_TASK;

			taskService.tasks.set(MOCKED_TASKS);

			taskService.updateIsCompletedStatusTask(updatedTask.id, true).subscribe({
				next: () => {
					fail('Failed to update a task is completed status');
				},
				error: (error: HttpErrorResponse) => {
					httpErrorResponse = error;
				}
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks/${updatedTask.id}`);

			req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);
		}));
	});

	describe('deleteTask', () => {
		it('Should delete a task', waitForAsync(() => {
			const updatedTask: Task = MOCKED_TASK;
			taskService.tasks.set(MOCKED_TASKS);

			taskService.deleteTask(MOCKED_TASK.id).subscribe(() => {
				expect(taskService.tasks().length).toEqual(1);
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks/${updatedTask.id}`);

			req.flush(null);

			expect(req.request.method).toEqual("DELETE");
		}));

		it('Should throw unprocessable entity with invalid body when delete a task', waitForAsync(() => {
			let httpErrorResponse: HttpErrorResponse | undefined;

			taskService.tasks.set(MOCKED_TASKS);

			taskService.deleteTask(MOCKED_TASK.id).subscribe({
				next: () => {
					fail('Failed delete a task');
				},
				error: (error: HttpErrorResponse) => {
					httpErrorResponse = error;
				}
			});

			const req = httpTestingController.expectOne(`${BASE_URL}/tasks/${MOCKED_TASK.id}`);

			req.flush('Unprocessable Entity', TASK_UNPROCESSIBLE_ENTITY_RESPONSE);
		}));
	});
});