import React, { useState, useEffect } from 'react';
import { Upload, Camera, Leaf, AlertCircle, CheckCircle, Loader2, Sparkles, ArrowRight, Zap, Shield, Target } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageChange = (file) => {
    setImage(file);
    setPrediction('');
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) handleImageChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setPrediction(data.prediction || 'No prediction returned.');
    } catch (err) {
      console.error(err);
      setPrediction('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setPreview('');
    setPrediction('');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-teal-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_theme(colors.emerald.500/0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_theme(colors.teal.500/0.1)_0%,_transparent_50%)]"></div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>


      {/* Header */}
      <div className="relative z-20 backdrop-blur-xl bg-black/40 border-b border-emerald-500/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                  <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent animate-pulse">
                  PlantAI
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">Plant Health Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span className="text-xs sm:text-sm font-semibold">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Upload Section - Mobile First, Desktop 7 cols */}
          <div className="xl:col-span-7 space-y-6">
            {/* Hero Section for Mobile */}
            <div className="xl:hidden text-center py-8">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Diagnose Plant Health
              </h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
                Upload Tomato, Potato and Bell Pepper images and get instant AI-powered disease detection with 90% accuracy
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-emerald-500/20 p-6 sm:p-8 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Upload Plant Image</h3>
              </div>
              
              {/* Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-500 group cursor-pointer ${
                  dragActive 
                    ? 'border-emerald-400 bg-emerald-500/10 scale-105' 
                    : 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/5 hover:scale-102'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
                      <Upload className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold text-white mb-2">
                      Drop your image here, or <span className="text-emerald-400">browse</span>
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports JPG, PNG • Max 10MB • Best results with clear, close-up shots
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview and Analysis */}
              {preview && (
                <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative bg-black/50 rounded-2xl overflow-hidden border border-emerald-500/20">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-48 sm:h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={resetImage}
                        className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                      >
                        <span className="text-xs">✕</span>
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!image || loading}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 sm:py-5 px-6 rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 disabled:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-base sm:text-lg">Analyzing Magic...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 group-hover:animate-pulse" />
                          <span className="text-base sm:text-lg">Analyze with AI</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Section - Mobile Full Width, Desktop 5 cols */}
          <div className="xl:col-span-5 space-y-6">
            {/* Desktop Hero */}
            <div className="hidden xl:block text-center py-8">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                Diagnose Plant Health
              </h2>
              <p className="text-gray-400 text-base">
                Upload Tomato, Potato and Bell Pepper images and get instant AI-powered disease detection with 90% accuracy
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-teal-500/20 p-6 sm:p-8 shadow-2xl shadow-teal-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">AI Analysis</h3>
              </div>
              
              {!prediction && !loading && (
                <div className="text-center py-8 sm:py-12">
                  <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-6">
                    <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-white font-semibold text-base sm:text-lg mb-2">Ready for Analysis</p>
                  <p className="text-gray-400 text-sm">
                    Upload a plant image to get instant AI-powered health diagnosis
                  </p>
                </div>
              )}
              
              {loading && (
                <div className="text-center py-8 sm:py-12">
                  <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-6">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/50">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  </div>
                  <p className="text-white font-bold text-base sm:text-lg mb-2">Model Processing...</p>
                  <p className="text-gray-400 text-sm">Analyzing plant health patterns</p>
                  <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              {prediction && !loading && (
                <div className="space-y-4 sm:space-y-6">
                  <div className={`relative overflow-hidden p-4 sm:p-6 rounded-2xl border-l-4 ${
                    prediction.toLowerCase().includes('error') 
                      ? 'bg-red-500/10 border-red-400 backdrop-blur-sm' 
                      : 'bg-emerald-500/10 border-emerald-400 backdrop-blur-sm'
                  }`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      {prediction.toLowerCase().includes('error') ? (
                        <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className={`font-bold text-base sm:text-lg ${
                          prediction.toLowerCase().includes('error') 
                            ? 'text-red-300' 
                            : 'text-emerald-300'
                        }`}>
                          {prediction.toLowerCase().includes('error') ? 'Analysis Error' : 'Diagnosis Complete'}
                        </h4>
                        <p className={`mt-2 text-sm sm:text-base ${
                          prediction.toLowerCase().includes('error') 
                            ? 'text-red-200' 
                            : 'text-emerald-200'
                        }`}>
                          {prediction}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
              {[
                { icon: Camera, title: "HD Image Processing", desc: "Advanced computer vision", color: "emerald" },
                { icon: Zap, title: "Instant Results", desc: "Sub-second analysis", color: "teal" },
                { icon: Shield, title: "90% Accuracy", desc: "Scientifically Validated", color: "emerald" },
                { icon: Sparkles, title: "AI-Powered", desc: "Deep learning models", color: "teal" }
              ].map((feature, i) => (
                <div key={i} className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group">
                  <div className={`w-10 h-10 bg-gradient-to-r from-${feature.color}-500 to-${feature.color === 'emerald' ? 'teal' : 'emerald'}-400 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-${feature.color}-500/30`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-white text-sm sm:text-base mb-1">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;