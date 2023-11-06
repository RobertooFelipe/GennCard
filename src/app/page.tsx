import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Hello word, i&apos;m Genn Card</h1>
      <p>You can access this links to upload you files</p>

      <div className="text-center flex flex-col mt-8 gap-2">
        <Link
          className="bg-white p-2 px-8 text-black rounded hover:opacity-80"
          href={"pages/UploadPage"}
          target="_blank"
        >
          Public files here
        </Link>
        <p>Or</p>
        <Link
          className="bg-white p-2 px-8 text-black rounded hover:opacity-80"
          href={"pages/ProtectUploadPage"}
          target="_blank"
        >
          Private files here
        </Link>
      </div>
    </main>
  );
}
