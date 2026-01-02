import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  id: string;
  image: string;
  partName: string;
  partNumber: string;
  date: string;
  compatibility: string[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'compare'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [sourceImage, setSourceImage] = useState<string>('');
  const [targetImage, setTargetImage] = useState<string>('');
  const [history, setHistory] = useState<AnalysisResult[]>([
    {
      id: '1',
      image: '/placeholder.svg',
      partName: 'Тормозной диск передний',
      partNumber: 'BR-2847-VNT',
      date: '2026-01-02',
      compatibility: ['BMW 3 Series', 'BMW 5 Series', 'BMW X3']
    },
    {
      id: '2',
      image: '/placeholder.svg',
      partName: 'Амортизатор задний',
      partNumber: 'SH-1923-KYB',
      date: '2026-01-01',
      compatibility: ['Toyota Camry', 'Toyota RAV4']
    }
  ]);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const newResult: AnalysisResult = {
        id: Date.now().toString(),
        image: reader.result as string,
        partName: 'Анализируется...',
        partNumber: '...',
        date: new Date().toISOString().split('T')[0],
        compatibility: []
      };
      
      setHistory(prev => [newResult, ...prev]);
      
      setTimeout(() => {
        setHistory(prev => prev.map(item => 
          item.id === newResult.id 
            ? {
                ...item,
                partName: 'Масляный фильтр',
                partNumber: 'OF-4521-MNN',
                compatibility: ['Honda Accord', 'Honda Civic', 'Acura TLX']
              }
            : item
        ));
        toast({
          title: 'Анализ завершён',
          description: 'Деталь успешно распознана',
        });
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Icon name="Wrench" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">AutoParts AI</h1>
              <p className="text-sm text-muted-foreground">Анализ деталей по фото</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-2"
          >
            <Icon name="Upload" size={18} />
            Загрузка
          </Button>
          <Button
            variant={activeTab === 'compare' ? 'default' : 'outline'}
            onClick={() => setActiveTab('compare')}
            className="flex items-center gap-2"
          >
            <Icon name="ArrowLeftRight" size={18} />
            Перенос детали
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className="flex items-center gap-2"
          >
            <Icon name="History" size={18} />
            История ({history.length})
          </Button>
        </div>

        {activeTab === 'upload' && (
          <div className="animate-fade-in">
            <Card className="p-12 border-2 border-dashed border-border hover:border-primary transition-colors">
              <div
                className={`flex flex-col items-center justify-center gap-6 ${
                  dragActive ? 'scale-105' : ''
                } transition-transform`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Camera" size={48} className="text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Загрузите фото детали
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Перетащите изображение сюда или выберите файл
                  </p>
                  <label htmlFor="file-input">
                    <Button type="button" className="cursor-pointer" asChild>
                      <span>
                        <Icon name="Upload" size={18} className="mr-2" />
                        Выбрать файл
                      </span>
                    </Button>
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </div>
            </Card>

            {history.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                  Последние анализы
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {history.slice(0, 3).map((item, index) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 animate-scale-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.partName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-heading font-semibold text-lg text-foreground mb-1">
                          {item.partName}
                        </h4>
                        <p className="text-sm text-primary font-mono mb-2">{item.partNumber}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon name="Calendar" size={14} />
                          {item.date}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="animate-fade-in space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                Визуализация переноса детали
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Car" size={20} className="text-primary" />
                    Синее авто (исходное)
                  </h3>
                  <Card className="border-2 border-dashed border-primary/50 hover:border-primary transition-colors">
                    {sourceImage ? (
                      <div className="relative group">
                        <img src={sourceImage} alt="Синее авто" className="w-full h-64 object-cover rounded" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSourceImage('')}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="source-input" className="cursor-pointer block p-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="Upload" size={32} className="text-primary" />
                          </div>
                          <p className="text-muted-foreground text-center">
                            Загрузить фото синего авто
                          </p>
                        </div>
                      </label>
                    )}
                  </Card>
                  <input
                    id="source-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setSourceImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Car" size={20} className="text-secondary" />
                    Красное авто (целевое)
                  </h3>
                  <Card className="border-2 border-dashed border-secondary/50 hover:border-secondary transition-colors">
                    {targetImage ? (
                      <div className="relative group">
                        <img src={targetImage} alt="Красное авто" className="w-full h-64 object-cover rounded" />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setTargetImage('')}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="target-input" className="cursor-pointer block p-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                            <Icon name="Upload" size={32} className="text-secondary" />
                          </div>
                          <p className="text-muted-foreground text-center">
                            Загрузить фото красного авто
                          </p>
                        </div>
                      </label>
                    )}
                  </Card>
                  <input
                    id="target-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setTargetImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {sourceImage && targetImage && (
                <div className="mt-8 animate-fade-in">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="px-4 text-muted-foreground font-semibold">Результат</span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">До (красное авто)</p>
                        <img src={targetImage} alt="До" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground font-semibold mb-3 flex items-center gap-2">
                          <Icon name="Sparkles" size={16} className="text-secondary" />
                          После (с крышкой заднего сидения)
                        </p>
                        <div className="relative">
                          <img src={targetImage} alt="После" className="w-full h-48 object-cover rounded-lg" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                            <div className="text-center">
                              <Icon name="Wand2" size={32} className="text-secondary mx-auto mb-2" />
                              <p className="text-white font-semibold">AI визуализация</p>
                              <p className="text-white/70 text-sm">в разработке</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-card rounded-lg">
                      <div className="flex items-start gap-3">
                        <Icon name="Info" size={20} className="text-primary mt-0.5" />
                        <div>
                          <p className="text-foreground font-semibold mb-1">Информация о крышке</p>
                          <p className="text-muted-foreground text-sm">
                            На синем авто установлена крышка заднего сидения. Для установки такой же детали на красное авто 
                            рекомендуется обратиться к специалистам для подбора совместимой модели.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.partName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-heading font-semibold text-xl text-foreground mb-2">
                      {item.partName}
                    </h4>
                    <p className="text-sm text-primary font-mono mb-3 bg-primary/10 px-2 py-1 rounded inline-block">
                      {item.partNumber}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Icon name="Calendar" size={16} />
                      {item.date}
                    </div>
                    {item.compatibility.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Icon name="CheckCircle" size={16} className="text-secondary" />
                          Совместимость
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.compatibility.map((car, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full"
                            >
                              {car}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;