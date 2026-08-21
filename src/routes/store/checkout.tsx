import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, CreditCard, Lock } from 'lucide-react';

export const Route = createFileRoute('/store/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container px-4 mx-auto max-w-[1000px]">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Form */}
          <div className="flex-[2] space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold">Informações de Entrega</h2>
                <span className="text-xs text-muted-foreground">Passo 1 de 2</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Nome impresso no documento" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" placeholder="Rua, Número, Complemento" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-bold">Pagamento</h2>
                <div className="flex gap-2">
                  <div className="h-6 w-10 bg-slate-100 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                  <div className="h-6 w-10 bg-slate-100 rounded flex items-center justify-center text-[8px] font-bold">MASTERCARD</div>
                  <div className="h-6 w-10 bg-slate-100 rounded flex items-center justify-center text-[8px] font-bold">PIX</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 border-2 border-primary bg-primary/5 rounded-xl cursor-pointer">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-bold text-sm">Cartão de Crédito</p>
                    <p className="text-xs text-muted-foreground">Até 12x com juros</p>
                  </div>
                  <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Número do Cartão</Label>
                    <Input placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Validade</Label>
                      <Input placeholder="MM/AA" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Link to="/store/confirmation">
              <Button className="w-full h-14 text-lg font-bold rounded-xl mt-4 shadow-lg shadow-primary/20">
                Finalizar Compra
              </Button>
            </Link>
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> Ambiente seguro e criptografado
            </p>
          </div>

          {/* Summary */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24 space-y-6">
              <h2 className="font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Resumo do Pedido
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-16 w-16 rounded-lg bg-slate-100 border overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200" className="object-cover h-full w-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold line-clamp-1">Smartphone Pro 5G</p>
                    <p className="text-xs text-muted-foreground">Qtd: 1</p>
                    <p className="text-sm font-bold mt-1">R$ 2.999,00</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ 2.999,00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-primary">R$ 2.999,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
