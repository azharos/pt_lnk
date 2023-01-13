import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/">
					<Redirect to="/login" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
