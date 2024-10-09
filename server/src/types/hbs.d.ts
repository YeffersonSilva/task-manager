// src/types/hbs.d.ts
declare module "nodemailer-express-handlebars" {
    import { Transporter, SendMailOptions } from "nodemailer";
  
    interface NodemailerExpressHandlebarsOptions {
      viewEngine: {
        extName: string;
        partialsDir: string;
        defaultLayout: boolean | string; // Asegúrate de que esto sea compatible
        layoutsDir?: string; // Opcional, pero bueno tenerlo
      };
      viewPath: string;
      extName: string;
    }
  
    type PluginFunction<T> = (transporter: Transporter) => void;
  
    function hbs(options: NodemailerExpressHandlebarsOptions): PluginFunction<SendMailOptions>;
  
    export default hbs;
  }
  