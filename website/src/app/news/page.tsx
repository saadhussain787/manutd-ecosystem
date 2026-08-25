export const metadata = {
  title: 'News | Manchester United',
};

export default function NewsPage() {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold font-oswald mb-6">Latest News</h2>
        <div className="text-center text-gray-500 py-12">
          News content coming soon...
        </div>
      </div>
    </div>
  );
}
