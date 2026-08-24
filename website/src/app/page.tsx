export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-heading text-[var(--color-utd-red)] uppercase tracking-wider mb-4">
          Manchester United
        </h1>
        <h2 className="text-2xl font-body text-[var(--color-utd-gold)] uppercase tracking-widest font-bold">
          Live Data Ecosystem
        </h2>
      </header>
      
      <section className="text-center max-w-2xl bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl">
        <p className="text-gray-300 text-lg font-body leading-relaxed mb-6">
          Welcome to your live local development server! Every change we make to the code will instantly appear right here.
        </p>
        <p className="text-gray-400 text-sm italic">
          Next Step: We will fetch the data from the S3 bucket and visualize it with Recharts.
        </p>
      </section>
    </main>
  );
}
