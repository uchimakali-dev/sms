import { Link } from "react-router-dom";

function Home(){
    return (
        <>
        <h1>
            Home page
        </h1>
        <Link to={"/login"} className="bg-blue-400 rounded-lg p-4">Login</Link>
        </>
    )
}

export default Home;
