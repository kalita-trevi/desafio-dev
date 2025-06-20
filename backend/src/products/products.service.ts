import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  provider: 'brazilian' | 'european';
}

@Injectable()
export class ProductsService {
  private brazilianUrl = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider';
  private europeanUrl = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider';

  constructor(private http: HttpService) {}

  private getImage(url: string, id: string): string {
    if (url && url.includes('placeimg.com')) {
      return `https://picsum.photos/seed/${id}/640/480`;
    }
    return url || `https://picsum.photos/seed/${id}/640/480`;
  }

  private mapBrazilian(p: any): Product {
    return {
      id: p.id,
      name: p.nome || p.name || '',
      price: Number(p.preco),
      image: this.getImage(p.imagem, p.id),
      description: p.descricao,
      provider: 'brazilian',
    };
  }

  private mapEuropean(p: any): Product {
    const img = Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery[0] : '';
    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      image: this.getImage(img, p.id),
      description: p.description,
      provider: 'european',
    };
  }

  async findAll(provider?: string): Promise<Product[]> {
    if (provider && provider !== 'all') {
      // Filtrar por fornecedor específico
      if (provider === 'brazilian') {
        const brRes = await lastValueFrom(this.http.get(this.brazilianUrl));
        return brRes.data.map((p: any) => this.mapBrazilian(p));
      } else if (provider === 'european') {
        const euRes = await lastValueFrom(this.http.get(this.europeanUrl));
        return euRes.data.map((p: any) => this.mapEuropean(p));
      }
    }
    
    // Retornar todos os produtos (comportamento padrão)
    const [brRes, euRes] = await Promise.all([
      lastValueFrom(this.http.get(this.brazilianUrl)),
      lastValueFrom(this.http.get(this.europeanUrl)),
    ]);
    const br = brRes.data.map((p: any) => this.mapBrazilian(p));
    const eu = euRes.data.map((p: any) => this.mapEuropean(p));
    return [...br, ...eu];
  }

  async findOne(provider: string, id: string): Promise<Product> {
    let url = '';
    let mapper: (p: any) => Product;
    if (provider === 'brazilian') {
      url = `${this.brazilianUrl}/${id}`;
      mapper = (p) => this.mapBrazilian(p);
    } else if (provider === 'european') {
      url = `${this.europeanUrl}/${id}`;
      mapper = (p) => this.mapEuropean(p);
    } else {
      throw new Error('Fornecedor inválido');
    }
    const res = await lastValueFrom(this.http.get(url));
    return mapper(res.data);
  }
}
