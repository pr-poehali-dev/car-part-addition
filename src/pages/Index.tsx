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
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [dragActive, setDragActive] = useState(false);
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
                    <Button className="cursor-pointer">
                      <Icon name="Upload" size={18} className="mr-2" />
                      Выбрать файл
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
