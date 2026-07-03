import express from "express";
import { getEmployee, getEmployees, getRandomEmployee } from "#db/employees";
import employees from "#db/employees";

const app = express();
export default app;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello employees!");
});

app.get("/employees", (req, res) => {
  const employees = getEmployees();
  res.send(employees);
});

// Note: this middleware has to come first! Otherwise, Express will treat
// "random" as the argument to the `id` parameter of /employees/:id.
app.get("/employees/random", (req, res) => {
  const employee = getRandomEmployee();
  res.send(employee);
});

app.get("/employees/:id", (req, res) => {
  const { id } = req.params;

  // req.params are always strings, so we need to convert `id` into a number
  // before we can use it to find the employee
  const employee = getEmployee(+id);

  if (!employee) {
    return res.status(404).send(`Employee #${id} not found.`);
  }

  res.send(employee);
});

app.post("/employees", (req, res) => {
  if (!req.body || !req.body.name)
    res.status(400).send("Missing request body.");
  else {
    const { name } = req.body;
    console.log("name", name);
    // if (!name) res.status(400).send("Missing employee name.");
    const employee = { id: employees.length + 1, name };
    employees.push(employee);
    res.status(201).send(employee);
    // res.status(201).send("employee");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
