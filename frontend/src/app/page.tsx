// pages/index.tsx
import Link from "next/link";
import { FaUsers, FaLaptop, FaPaintBrush, FaLayerGroup } from "react-icons/fa";

export default function Home() {
  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center py-6 px-8 bg-white shadow-md fixed w-full z-50">
        <h1 className="text-2xl font-bold text-emerald-600">CollabBoard</h1>
        <div className="space-x-4">
          <Link href="/login">
            <button className="px-4 py-2 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-emerald-50 pt-32 md:pt-40 pb-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
              Collaborate in Real-Time on Your Ideas
            </h2>
            <p className="text-lg md:text-xl mb-6 animate-fadeIn delay-200">
              Draw, brainstorm, and share your whiteboard with anyone, anywhere.
            </p>
            <div className="flex justify-center md:justify-start gap-4 animate-fadeIn delay-400">
              <Link href="/signup">
                <button className="px-6 py-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition">
                  Get Started
                </button>
              </Link>
              <Link href="/login">
                <button className="px-6 py-3 rounded-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition">
                  Login
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center animate-fadeIn delay-600">
            {/* Placeholder Hero Image */}
            <div className="w-full max-w-md h-64 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <span className="text-gray-400">[Whiteboard Illustration]</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <h3 className="text-3xl font-bold text-center mb-12 animate-fadeIn">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition animate-fadeIn">
              <FaUsers className="text-emerald-600 text-5xl mb-4" />
              <h4 className="font-bold mb-2">Real-time Collaboration</h4>
              <p>Work together with your team seamlessly on the same board.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition animate-fadeIn delay-200">
              <FaLayerGroup className="text-emerald-600 text-5xl mb-4" />
              <h4 className="font-bold mb-2">Multiple Boards & Rooms</h4>
              <p>Create different boards for different projects or teams.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition animate-fadeIn delay-400">
              <FaPaintBrush className="text-emerald-600 text-5xl mb-4" />
              <h4 className="font-bold mb-2">Easy-to-use Tools</h4>
              <p>Draw, erase, and use shapes and colors intuitively.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition animate-fadeIn delay-600">
              <FaLaptop className="text-emerald-600 text-5xl mb-4" />
              <h4 className="font-bold mb-2">Cross-platform</h4>
              <p>Access CollabBoard on desktop, tablet, or mobile devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-emerald-50">
        <div className="container mx-auto px-6 md:px-12">
          <h3 className="text-3xl font-bold text-center mb-12 animate-fadeIn">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 animate-fadeIn">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="font-bold mb-2">Sign up or Log in</h4>
              <p>Create your account or login to start collaborating.</p>
            </div>
            <div className="text-center p-6 animate-fadeIn delay-200">
              <div className="text-4xl mb-4">➕</div>
              <h4 className="font-bold mb-2">Create or Join a Whiteboard</h4>
              <p>Start a new board or join an existing session.</p>
            </div>
            <div className="text-center p-6 animate-fadeIn delay-400">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="font-bold mb-2">Start Drawing</h4>
              <p>Collaborate in real-time using drawing tools and shapes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <h3 className="text-3xl font-bold text-center mb-12 animate-fadeIn">What Our Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg shadow-md text-center animate-fadeIn">
              <p className="italic mb-4">"CollabBoard makes team brainstorming so much easier!"</p>
              <h5 className="font-bold">— Jane Doe</h5>
            </div>
            <div className="p-6 rounded-lg shadow-md text-center animate-fadeIn delay-200">
              <p className="italic mb-4">"I love how simple and intuitive the interface is."</p>
              <h5 className="font-bold">— John Smith</h5>
            </div>
            <div className="p-6 rounded-lg shadow-md text-center animate-fadeIn delay-400">
              <p className="italic mb-4">"Real-time collaboration has never been this smooth."</p>
              <h5 className="font-bold">— Alex Lee</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-10 mt-12">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="#">About</Link>
            <Link href="#">Features</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="#"><span className="text-emerald-600">Twitter</span></Link>
            <Link href="#"><span className="text-emerald-600">LinkedIn</span></Link>
            <Link href="#"><span className="text-gray-800">GitHub</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
