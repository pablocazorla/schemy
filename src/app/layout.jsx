import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const OpenSans = localFont({
  src: "./fonts/OpenSans.woff2",
  display: "swap",
  variable: "--font-open-sans",
});
const OpenSansItalic = localFont({
  src: "./fonts/OpenSansItalic.woff2",
  display: "swap",
  variable: "--font-open-sans_italic",
});
const Shantell = localFont({
  src: "./fonts/Shantell.woff2",
  display: "swap",
  variable: "--font-shantell",
});
const ShantellItalic = localFont({
  src: "./fonts/ShantellItalic.woff2",
  display: "swap",
  variable: "--font-shantell_italic",
});
const Lora = localFont({
  src: "./fonts/Lora.woff2",
  display: "swap",
  variable: "--font-lora",
});
const LoraItalic = localFont({
  src: "./fonts/LoraItalic.woff2",
  display: "swap",
  variable: "--font-lora_italic",
});
const RobotoSlab = localFont({
  src: "./fonts/RobotoSlab.woff2",
  display: "swap",
  variable: "--font-roboto-slab",
});
const UbuntuMono = localFont({
  src: "./fonts/UbuntuMono.woff2",
  display: "swap",
  variable: "--font-ubuntu-mono",
});
const UbuntuMonoItalic = localFont({
  src: "./fonts/UbuntuMonoItalic.woff2",
  display: "swap",
  variable: "--font-ubuntu-mono_italic",
});

export const metadata = {
  title: "Schemy App",
  description: "Just draw your schematic!",
};

const qReg = new RegExp("'", "g");

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <Script src="https://unpkg.com/ml5@1/dist/ml5.js" />

      <body
        className={`${OpenSans.variable} ${OpenSansItalic.variable} ${Shantell.variable} ${ShantellItalic.variable} ${Lora.variable} ${LoraItalic.variable} ${RobotoSlab.variable} ${UbuntuMono.variable} ${UbuntuMonoItalic.variable} antialiased bg-zinc-100 text-gray-900 dark:bg-zinc-900 dark:text-white transition-colors`}
      >
        <div className="font-names hidden">
          <div className="opensans">
            {OpenSans.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="opensans_italic">
            {OpenSansItalic.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="shantell">
            {Shantell.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="shantell_italic">
            {ShantellItalic.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="lora">
            {Lora.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="lora_italic">
            {LoraItalic.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="robotoslab">
            {RobotoSlab.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="robotoslab_italic">
            {RobotoSlab.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="ubuntumono">
            {UbuntuMono.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
          <div className="ubuntumono_italic">
            {UbuntuMonoItalic.style.fontFamily.split(",")[0].replace(qReg, "")}
          </div>
        </div>
        <div className="font-keys hidden">
          <div
            className={OpenSans.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            opensans
          </div>
          <div
            className={OpenSansItalic.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            opensans_italic
          </div>
          <div
            className={Shantell.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            shantell
          </div>
          <div
            className={ShantellItalic.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            shantell_italic
          </div>
          <div
            className={Lora.style.fontFamily.split(",")[0].replace(qReg, "")}
          >
            lora
          </div>
          <div
            className={LoraItalic.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            lora_italic
          </div>
          <div
            className={RobotoSlab.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            robotoslab
          </div>
          <div
            className={UbuntuMono.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            ubuntumono
          </div>
          <div
            className={UbuntuMonoItalic.style.fontFamily
              .split(",")[0]
              .replace(qReg, "")}
          >
            ubuntumono_italic
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
