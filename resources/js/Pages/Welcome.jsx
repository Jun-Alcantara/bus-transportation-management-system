export default function Welcome({ user }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome to STS v2
                </h1>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Powered by Laravel & Inertia.js with React
                </p>
            </div>
        </div>
    )
}