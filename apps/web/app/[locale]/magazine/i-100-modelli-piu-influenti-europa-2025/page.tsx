import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'I 100 modelli più influenti d\'Europa - Classifica 2025 - Velgance Agency',
  description: 'Scopri la classifica dei 100 modelli più influenti d\'Europa nel 2025. Un\'analisi approfondita sui talenti che stanno ridefinendo l\'industria della moda europea.',
  keywords: 'modelli Europa, classifica modelli 2025, modelli influenti, fashion Europe, talenti moda',
  openGraph: {
    title: 'I 100 modelli più influenti d\'Europa - Classifica 2025',
    description: 'Scopri la classifica dei 100 modelli più influenti d\'Europa nel 2025. Un\'analisi approfondita sui talenti che stanno ridefinendo l\'industria della moda europea.',
    type: 'article',
    publishedTime: '2025-01-01T00:00:00.000Z',
    authors: ['Velgance Agency'],
    tags: ['modelli', 'Europa', 'classifica', '2025', 'fashion'],
  },
};

const modelsData = [
  // Top 50 Models from your list
  { name: 'Rosie Huntington-Whiteley', country: 'Regno Unito', category: 'Fashion & Beauty Icon' },
  { name: 'Cara Delevingne', country: 'Regno Unito', category: 'Multi-Talent & Activist' },
  { name: 'Doutzen Kroes', country: 'Paesi Bassi', category: 'Dutch Supermodel' },
  { name: 'Barbara Palvin', country: 'Ungheria', category: 'Beauty Ambassador' },
  { name: 'Elsa Hosk', country: 'Svezia', category: 'Sports & Lifestyle' },
  { name: 'Sara Sampaio', country: 'Portogallo', category: 'Portuguese Excellence' },
  { name: 'Romee Strijd', country: 'Paesi Bassi', category: 'Dutch Sophistication' },
  { name: 'Josephine Skriver', country: 'Danimarca', category: 'Scandinavian Beauty' },
  { name: 'Lara Stone', country: 'Paesi Bassi', category: 'Editorial Star' },
  { name: 'Jourdan Dunn', country: 'Regno Unito', category: 'British Diversity' },
  { name: 'Natalia Vodianova', country: 'Russia', category: 'International Supermodel' },
  { name: 'Irina Shayk', country: 'Russia', category: 'International Supermodel' },
  { name: 'Joan Smalls', country: 'Porto Rico/EU', category: 'International Presence' },
  { name: 'Kate Moss', country: 'Regno Unito', category: 'Legendary Icon' },
  { name: 'Lily Donaldson', country: 'Regno Unito', category: 'British Elegance' },
  { name: 'Adwoa Aboah', country: 'Regno Unito', category: 'Diversity Advocate' },
  { name: 'Anja Rubik', country: 'Polonia', category: 'High Fashion Icon' },
  { name: 'Magdalena Frąckowiak', country: 'Polonia', category: 'Polish Excellence' },
  { name: 'Bianca Balti', country: 'Italia', category: 'Italian Elegance' },
  { name: 'Vittoria Ceretti', country: 'Italia', category: 'Italian Modernity' },
  { name: 'David Gandy', country: 'Regno Unito', category: 'Male Supermodel Icon' },
  { name: 'Baptiste Giabiconi', country: 'Francia', category: 'French Elegance' },
  { name: 'Clement Chabernaud', country: 'Francia', category: 'Parisian Style' },
  { name: 'Louise Follain', country: 'Francia', category: 'French Sophistication' },
  { name: 'Oliver Cheshire', country: 'Regno Unito', category: 'British Charm' },
  { name: 'Johannes Huebl', country: 'Germania', category: 'German Precision' },
  { name: 'Mathias Lauridsen', country: 'Danimarca', category: 'Nordic Appeal' },
  { name: 'Luna Bijl', country: 'Paesi Bassi', category: 'Rising Star' },
  { name: 'Ola Rudnicka', country: 'Polonia', category: 'Polish Innovation' },
  { name: 'Jessie Bloemendaal', country: 'Paesi Bassi', category: 'Dutch Modernity' },
  { name: 'Imaan Hammam', country: 'Paesi Bassi/Regno Unito', category: 'Cultural Fusion' },
  { name: 'Leomie Anderson', country: 'Regno Unito', category: 'British Diversity' },
  { name: 'Aya Jones', country: 'Francia', category: 'French Elegance' },
  { name: 'Adut Akech', country: 'Regno Unito/Europa', category: 'Rising Star' },
  { name: 'Teddy Quinlivan', country: 'Regno Unito/Europa', category: 'Transgender Advocate' },
  { name: 'Edita Vilkeviciute', country: 'Lituania', category: 'Baltic Beauty' },
  { name: 'Vanessa Axente', country: 'Ungheria', category: 'Hungarian Excellence' },
  { name: 'Julia Banas', country: 'Polonia', category: 'Polish Modernity' },
  { name: 'Sami Miro', country: 'Svezia', category: 'Swedish Innovation' },
  { name: 'Hikari Mori', country: 'Europa', category: 'International Appeal' },
  { name: 'Sora Choi', country: 'Corea del Sud/Europa', category: 'Asian-European Fusion' },
  { name: 'Grace Elizabeth', country: 'Regno Unito', category: 'Fast-Rising Star' },
  { name: 'Sofia Mechetner', country: 'Israele/Europa', category: 'Middle Eastern Beauty' },
  { name: 'Dilone', country: 'Paesi Bassi', category: 'Dutch Diversity' },
  { name: 'Jeneil Williams', country: 'Regno Unito/Europa', category: 'British Caribbean' },
  { name: 'Vanessa Moody', country: 'Regno Unito', category: 'British Modernity' },
  { name: 'Magdalena Jasek', country: 'Polonia', category: 'Polish Sophistication' },
  { name: 'Nadine Leopold', country: 'Austria', category: 'Modern Classic' },
  { name: 'Saskia de Brauw', country: 'Paesi Bassi', category: 'Artistic Expression' },
  { name: 'Linda Tol', country: 'Paesi Bassi', category: 'Beauty & Fashion' },

  // Additional models from your comprehensive list
  { name: 'Daphne Groeneveld', country: 'Paesi Bassi', category: 'Editorial Star' },
  { name: 'Mariacarla Boscono', country: 'Italia', category: 'Fashion Week Regular' },
  { name: 'Julia Nobis', country: 'Australia/Regno Unito', category: 'Versatile Talent' },
  { name: 'Stella Maxwell', country: 'Belgio/Regno Unito', category: 'Fashion Chameleon' },
  { name: 'Helena Christensen', country: 'Danimarca', category: 'Legendary Icon' },
  { name: 'Freja Beha Erichsen', country: 'Danimarca', category: 'Scandinavian Beauty' },
  { name: 'Alina Baikova', country: 'Ucraina', category: 'Eastern European Talent' },
  { name: 'Isabeli Fontana', country: 'Italia', category: 'Veteran Excellence' },
  { name: 'Maartje Verhoef', country: 'Paesi Bassi', category: 'Dutch Sophistication' },
  { name: 'Hanne Gaby Odiele', country: 'Belgio', category: 'Belgian Innovation' },
  { name: 'Anna Ewers', country: 'Germania', category: 'German Engineering' },
  { name: 'Mica Argañaraz', country: 'Argentina/Europa', category: 'Cross-Continental' },
  { name: 'Signe Veit', country: 'Danimarca', category: 'Scandinavian Minimalism' },
  { name: 'Anais Mali', country: 'Francia/Polonia', category: 'Cultural Fusion' },
  { name: 'Kasia Struss', country: 'Polonia', category: 'Polish Excellence' },
  { name: 'Cara Santana', country: 'Spagna', category: 'Spanish Flair' },
  { name: 'Sarah Brannon', country: 'Italia', category: 'Italian Steadiness' },
  { name: 'Anna Cleveland', country: 'Francia', category: 'French Heritage' },
  { name: 'Lineisy Montero', country: 'Repubblica Dominicana/Europa', category: 'Caribbean-European' },
  { name: 'Julia Garner', country: 'Regno Unito/Europa', category: 'Acting Crossover' },
  { name: 'Simon Nessman', country: 'Regno Unito/Canada', category: 'International Appeal' },
  { name: 'Lucky Blue Smith', country: 'Cittadinanza Europea', category: 'Gen Z Icon' },
  { name: 'Sean O\'Pry', country: 'Internazionale/EU', category: 'Global Influence' },
  { name: 'Garrett Neff', country: 'Regno Unito/Europa', category: 'Versatile Male Model' },
  { name: 'Francisco Lachowski', country: 'Polonia', category: 'Eastern European Style' },
];

export default function Top100ModelsEurope2025() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/XY552cs9/Full-Body-Picture-7.png)'
          }}
        ></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block bg-[#faf8f5] text-[#212121] px-4 py-2 rounded-full text-sm font-medium mb-4">
              Classifica 2025
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 italic" style={{ fontFamily: 'serif' }}>
            I 100 modelli più influenti d'Europa
          </h1>
          
          <p className="text-xl text-white leading-relaxed max-w-3xl mx-auto mb-8">
            Un'analisi approfondita sui talenti che stanno ridefinendo l'industria della moda europea nel 2025, 
            combinando tradizione, innovazione e impatto culturale.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-white">
            <span>Pubblicato il 1° Gennaio 2025</span>
            <span>•</span>
            <span>Velgance Agency</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="mb-16">
            <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
              L'evoluzione del panorama moda europeo
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Il 2025 segna un momento di trasformazione significativa nell'industria della moda europea. 
              I modelli non sono più semplici volti, ma veri e propri influencer culturali che plasmano 
              le tendenze, promuovono la diversità e ridefiniscono gli standard di bellezza.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Questa classifica analizza l'impatto, l'influenza e la rilevanza di 100 talenti che stanno 
              guidando questa rivoluzione silenziosa, combinando successo commerciale, innovazione 
              creativa e responsabilità sociale.
            </p>
          </div>

          {/* Methodology */}
          <div className="mb-16 bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-light text-black mb-4 italic" style={{ fontFamily: 'serif' }}>
              Metodologia della classifica
            </h3>
            <p className="text-gray-700 leading-relaxed">
              La nostra analisi considera diversi fattori: presenza nelle campagne pubblicitarie, 
              copertine editoriali, partecipazione alle Fashion Week europee, influenza sui social media, 
              progetti di sostenibilità e advocacy sociale, oltre all'impatto culturale nel panorama moda.
            </p>
          </div>

          {/* Top Models Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-light text-black mb-8 italic text-center" style={{ fontFamily: 'serif' }}>
              I talenti che definiscono il futuro
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modelsData.map((model, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {model.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-black mb-2">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.country}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trends Analysis */}
          <div className="mb-16">
            <h2 className="text-3xl font-light text-black mb-8 italic" style={{ fontFamily: 'serif' }}>
              Tendenze emergenti nel 2025
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium text-black mb-4">Diversità e Inclusione</h3>
                <p className="text-gray-700 leading-relaxed">
                  L'industria europea abbraccia finalmente una rappresentazione più autentica della società, 
                  con modelli che celebrano diverse etnie, età, corporature e identità di genere.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-black mb-4">Sostenibilità</h3>
                <p className="text-gray-700 leading-relaxed">
                  I modelli diventano ambasciatori della moda sostenibile, promuovendo brand eco-friendly 
                  e sensibilizzando il pubblico sui temi ambientali.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-black mb-4">Digital Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  L'integrazione tra moda fisica e virtuale si intensifica, con modelli che navigano 
                  tra sfilate tradizionali e esperienze digitali immersive.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-black mb-4">Activism & Advocacy</h3>
                <p className="text-gray-700 leading-relaxed">
                  I modelli utilizzano la loro piattaforma per promuovere cause sociali, dai diritti umani 
                  alla parità di genere, diventando veri agenti di cambiamento.
                </p>
              </div>
            </div>
          </div>

          {/* Regional Highlights */}
          <div className="mb-16">
            <h2 className="text-3xl font-light text-black mb-8 italic" style={{ fontFamily: 'serif' }}>
              Eccellenze regionali
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">Paesi Nordici</h3>
                <p className="text-sm text-gray-600">
                  Continua la tradizione di eleganza minimalista scandinava, con modelli che incarnano 
                  la filosofia "less is more".
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">Europa dell'Est</h3>
                <p className="text-sm text-gray-600">
                  I talenti dell'Europa orientale portano una nuova energia e diversità culturale 
                  nel panorama moda europeo.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-black mb-2">Mediterraneo</h3>
                <p className="text-sm text-gray-600">
                  L'Italia e la Spagna mantengono la loro leadership nell'eleganza e nella passione, 
                  con modelli che esaltano la bellezza mediterranea.
                </p>
              </div>
            </div>
          </div>

          {/* Future Outlook */}
          <div className="mb-16">
            <h2 className="text-3xl font-light text-black mb-8 italic" style={{ fontFamily: 'serif' }}>
              Il futuro della modellistica europea
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Il 2025 rappresenta solo l'inizio di una trasformazione più ampia. I modelli europei 
              stanno ridefinendo il loro ruolo, passando da semplici interpreti visivi a veri 
              e propri influencer culturali e sociali.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              L'industria si muove verso un modello più inclusivo, sostenibile e autentico, 
              dove la diversità non è più un'eccezione ma la norma. I modelli di oggi sono 
              pionieri di questo cambiamento, dimostrando che la bellezza può essere potente 
              e responsabile allo stesso tempo.
            </p>
            
            <div className="bg-[#faf8f5] p-8 rounded-lg text-center">
              <p className="text-lg text-[#212121] font-medium">
                "Il futuro della moda europea appartiene a chi sa coniugare estetica e etica, 
                bellezza e responsabilità sociale."
              </p>
              <p className="text-sm text-gray-600 mt-2">- Velgance Agency, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-black mb-6 italic" style={{ fontFamily: 'serif' }}>
            Unisciti alla rivoluzione
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Scopri come Velgance Agency sta plasmando il futuro della modellistica europea, 
            connettendo talenti unici con le migliori opportunità del settore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/models/application" 
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Candidati come modello
            </a>
            <a 
              href="/contact" 
              className="border border-black text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contattaci
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
