import { createFileRoute, Link } from '@tanstack/react-router';
import { CheckCircle2, Package, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/store/confirmation')({
  component: ConfirmationPage,
});

function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-[500px] w-full text-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Pedido Confirmado!</h1>
          <p className="text-slate-600">
            Obrigado pela sua compra. Enviamos um e-mail com todos os detalhes do seu pedido <strong>#ORD-99231</strong>.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border text-left space-y-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-bold">Status do Envio</p>
              <p className="text-xs text-muted-foreground">Preparando para envio pelo fornecedor</p>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-primary rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/store">
            <Button variant="outline" className="w-full rounded-full h-12">
              Voltar para a Loja
            </Button>
          </Link>
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
            <Share2 className="h-4 w-4" /> Compartilhar compra
          </Button>
        </div>
      </div>
    </div>
  );
}
