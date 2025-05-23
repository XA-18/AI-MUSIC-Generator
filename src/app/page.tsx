import AiMusicGenerator from './components/MusicGenerator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        <AiMusicGenerator />
      </div>
    </main>
  );
} 