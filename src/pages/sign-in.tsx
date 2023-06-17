import Head from "next/head";

const SignIn = () => {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center flex-col gap-4">
          <h1 className="text-xl font-medium">Sign in</h1>
          <input placeholder="Username" className="border p-2 rounded-sm" />
          <input placeholder="Password" className="border p-2 rounded-sm" />
          <button className="bg-black p-2 rounded-md text-white w-full">
            Login
          </button>
        </div>
      </div>
    </>
  );
};

export default SignIn;
