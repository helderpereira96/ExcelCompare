import { Injectable } from "@angular/core";
import { HotToastService } from "@ngneat/hot-toast";

@Injectable()
export class NotificacaoService {
    constructor(private toast: HotToastService) {
    }

    notificacaoSucesso(msg: string) {
        this.toast.success(msg, { position: 'top-center', duration: 3500, className: "toast-success toast-mensagem" });
    }

    notificacaoAlerta(msg: string) {
        this.toast.warning(msg, { position: 'top-center', duration: 3500, className: "toast-warning toast-mensagem" });
    }

    notificacaoErro(msg: string) {
        this.toast.error(msg, { position: 'top-center', duration: 3500, className: "toast-error toast-mensagem" });
    }
}
