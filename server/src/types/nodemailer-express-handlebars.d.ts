declare module 'nodemailer-express-handlebars' {
    import { SendMailOptions } from 'nodemailer';
  
    interface NodemailerExpressHandlebarsOptions {
      viewEngine: any;
      viewPath: string;
      extName?: string;
    }
  
    function nodemailerExpressHandlebars(options: NodemailerExpressHandlebarsOptions): (mail: SendMailOptions) => void;
  
    export = nodemailerExpressHandlebars;
  }
  