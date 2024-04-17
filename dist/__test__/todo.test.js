"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const todos_js_1 = require("./../controllers/todos.js");
const todo_js_1 = __importDefault(require("./../models/todo.js"));
//clear mocks manually
// beforeEach(() => {
//   jest.clearAllMocks();
// });
const mockRequest = {
    params: {
        id: '661c004f4da41723b2ddf23',
    },
};
const mockResponse = {
    render: jest.fn(),
};
const next = jest.fn();
//? Mocked out Todo model
jest.mock('./../models/todo.js', () => ({
    findById: jest.fn(id => ({
        id: '661c004f4da41723b2ddf237',
        text: 'Learn testing',
        completed: true,
        user: '661c00464da41723b2ddf230',
    })),
}));
describe('get a todo', () => {
    it('Get todo by id', async () => {
        await (0, todos_js_1.getTodo)(mockRequest, mockResponse, next);
        expect(todo_js_1.default.findById).toHaveBeenCalled();
        expect(todo_js_1.default.findById).toHaveBeenCalledWith(mockRequest.params.id);
        expect(todo_js_1.default.findById).toHaveBeenCalledTimes(1);
        expect(todo_js_1.default.findById).toHaveReturnedWith({
            id: '661c004f4da41723b2ddf237',
            text: 'Learn testing',
            completed: true,
            user: '661c00464da41723b2ddf230',
        });
        expect(mockResponse.render).toHaveBeenCalled();
        expect(mockResponse.render).toHaveBeenCalledWith('todos/show', {
            todo: {
                id: '661c004f4da41723b2ddf237',
                text: 'Learn testing',
                completed: true,
                user: '661c00464da41723b2ddf230',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });
    it('Should call the next function', async () => {
        const mockRequestCopy = {
            params: {
                id: '1',
            },
        };
        await (0, todos_js_1.getTodo)(mockRequestCopy, mockResponse, next);
        expect(todo_js_1.default.findById).toHaveBeenCalled();
        expect(todo_js_1.default.findById).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalled();
    });
});
describe('');
//# sourceMappingURL=todo.test.js.map