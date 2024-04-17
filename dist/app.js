"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const method_override_1 = __importDefault(require("method-override"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const todo_1 = __importDefault(require("./routes/todo"));
const user_1 = __importDefault(require("./routes/user"));
const middleware_1 = require("./middleware/middleware");
const todos_1 = require("./controllers/todos");
mongoose_1.default
    .connect('mongodb://localhost:27017/todolistapplicationDB')
    .then(msg => console.log('Connected to Database'))
    .catch(err => {
    console.log('Ohhhh NOOOO, ERRRORRRR!!!!');
    console.error(err);
});
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '/views'));
app.use((0, cookie_parser_1.default)());
app.use((0, method_override_1.default)('_method'));
app.use(express_1.default.static(path_1.default.join(__dirname, '/public')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('*', middleware_1.checkUser);
app.get('/', middleware_1.authenticate, todos_1.renderHomepage);
app.use('/', user_1.default);
app.use('/todos', todo_1.default);
app.use(function (err, req, res, next) {
    const errors = {
        fullname: '',
        email: '',
        password: err.message.startsWith('L') ? err.message.slice(1) : '',
    };
    if (err.code === 11000) {
        errors.email = 'Email already taken';
    }
    if (err.name === 'ValidationError') {
        Object.values(err.errors).forEach(properties => {
            const { path } = properties;
            if (path === 'fullname')
                errors.fullname = 'Fullname must be longer';
            if (path === 'email')
                errors.email = 'Enter a valid email';
            if (path === 'password')
                errors.password = 'Password be at least 6 characters long';
        });
    }
    res.status(500).json({ errors });
});
app.listen(3000, () => console.log('App is listening on port 3000'));
//# sourceMappingURL=app.js.map