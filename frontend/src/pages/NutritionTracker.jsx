import React, { useState, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Search, X, Loader2, Apple, Flame, ChevronRight, Info } from 'lucide-react';

export const NutritionTracker = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    let html5QrCode;
    
    if (isScanning) {
      setCameraError(null);
      // Give a tiny delay to ensure the div #reader is fully mounted in the DOM
      setTimeout(() => {
        html5QrCode = new Html5Qrcode("reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128
          ]
        });
        html5QrCode.start(
          { facingMode: "environment" }, 
          { 
            fps: 20, 
            qrbox: { width: 300, height: 150 }, // Rectangular box is much better for barcodes
            disableFlip: false // Allow scanning flipped barcodes
          },
          (decodedText) => {
            // Success
            html5QrCode.stop().then(() => {
              setIsScanning(false);
              fetchProductData(decodedText);
            }).catch(err => console.error("Error stopping", err));
          },
          (errorMessage) => {
            // Ignore frequent frame errors
          }
        ).catch((err) => {
          setCameraError("Camera blocked or not found. Please allow camera permissions.");
          console.error("Camera start error: ", err);
        });
      }, 100);
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(error => console.error("Failed to stop scanner: ", error));
      }
    };
  }, [isScanning]);

  const fetchProductData = async (barcode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1) {
        const product = data.product;
        setScanResult({
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          image: product.image_url || null,
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
          protein: product.nutriments?.proteins_100g || 0,
          carbs: product.nutriments?.carbohydrates_100g || 0,
          fat: product.nutriments?.fat_100g || 0,
          servingSize: product.serving_size || '100g',
        });
      } else {
        setError('Product not found in Open Food Facts database.');
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif text-primary mb-3">Nutrition Scanner</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Scan any food barcode to instantly pull nutritional information, calories, and macros from a global database.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Scanner Area */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          {!isScanning ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera size={40} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Scan a Barcode</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-[250px] mx-auto">
                Use your device camera to scan the barcode on any food packaging.
              </p>
              <button 
                onClick={() => setIsScanning(true)}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2 mx-auto mb-6 w-full max-w-[250px] justify-center"
              >
                <Camera size={18} /> Start Camera
              </button>
              
              <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-muted-foreground text-sm font-medium">OR</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = e.target.elements.barcode.value;
                  if (val) fetchProductData(val);
                }}
                className="flex gap-2 max-w-[300px] mx-auto"
              >
                <input 
                  type="text" 
                  name="barcode"
                  placeholder="Enter barcode manually..." 
                  className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="submit" className="bg-foreground text-background px-4 py-2 rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors">
                  Search
                </button>
              </form>
            </motion.div>
          ) : (
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Camera Active
                </h3>
                <button 
                  onClick={() => setIsScanning(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X size={20} />
                </button>
              </div>
              
              {cameraError ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl p-4 text-center">
                  <p className="font-medium mb-4">{cameraError}</p>
                  <button 
                    onClick={() => setIsScanning(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Close Scanner
                  </button>
                </div>
              ) : (
                <div id="reader" className="w-full min-h-[300px] overflow-hidden rounded-xl bg-card border border-border"></div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Results Area */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden">
          
          {loading && (
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-primary mb-4" size={32} />
              <p className="font-bold text-foreground">Fetching Nutrition Data...</p>
            </div>
          )}

          {!scanResult && !error && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center">
              <Apple size={48} className="mb-4 opacity-20" />
              <p>Scan a product to see its nutritional information here.</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
              <Info className="text-red-500 mb-2" size={32} />
              <p className="text-red-500 font-medium">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-4 text-sm text-foreground hover:underline"
              >
                Clear
              </button>
            </div>
          )}

          <AnimatePresence>
            {scanResult && !loading && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-6">
                  {scanResult.image ? (
                    <img src={scanResult.image} alt={scanResult.name} className="w-24 h-24 object-cover rounded-xl border border-border bg-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground leading-tight mb-1">{scanResult.name}</h2>
                    <p className="text-muted-foreground">{scanResult.brand}</p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-foreground">Nutrition Facts</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Per 100g</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg p-3 border border-border flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Flame size={12}/> Calories</span>
                      <span className="text-xl font-bold text-foreground">{Math.round(scanResult.calories)} kcal</span>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Protein</span>
                      <span className="text-xl font-bold text-foreground">{Math.round(scanResult.protein)}g</span>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Carbs</span>
                      <span className="text-xl font-bold text-foreground">{Math.round(scanResult.carbs)}g</span>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Fat</span>
                      <span className="text-xl font-bold text-foreground">{Math.round(scanResult.fat)}g</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <button className="w-full bg-foreground text-background py-3 rounded-xl font-bold hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                    Log this food <ChevronRight size={18} />
                  </button>
                  <button 
                    onClick={() => setScanResult(null)}
                    className="w-full py-3 text-muted-foreground hover:text-foreground font-medium text-sm mt-2 transition-colors"
                  >
                    Scan something else
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
