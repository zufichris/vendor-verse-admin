import { GoogleSignIn } from "./google-sign-in";

export default async function Page({ searchParams }: { searchParams: { code?: string } }) {
    const code = searchParams.code
    return <GoogleSignIn code={code!} />;
}
