import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate, Link } from "react-router-dom";
import regexConfig from "../util/regex.util";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const { login, isCheckingAuth, authError, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setError(authError || "");
    }, [authError]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password } = formData;

        if (!regexConfig.email.test(email)) {
            setError("Invalid email address.");
            return;
        }
        if (!regexConfig.password.test(password)) {
            setError("Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
            return;
        }

        await login(email, password);
    };

    const inputFields = [
        { id: "email", label: "Email", type: "email" },
        { id: "password", label: "Password", type: "password" }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-display font-extrabold text-center mb-8 text-gray-900">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {inputFields.map(({ id, label, type }) => (
                        <div key={id}>
                            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                                {label}
                            </label>
                            <input
                                id={id}
                                type={type}
                                required
                                value={formData[id as keyof typeof formData]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                autoComplete={id === "password" ? "current-password" : "on"}
                            />
                        </div>
                    ))}
                    
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={isCheckingAuth}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
                    >
                        {isCheckingAuth ? "Logging in..." : "Login"}
                    </button>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
