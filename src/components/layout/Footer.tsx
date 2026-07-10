import { Phone, Mail, MapPin, Globe, Play } from 'lucide-react';
import { CONTACT, ADDRESSES, SITE } from '@/lib/constants';

const contactInfo = [
  {
    icon: Phone,
    label: 'Hotline',
    value: CONTACT.phone,
    href: `tel:${CONTACT.phoneRaw}`,
  },
  {
    icon: Phone,
    label: 'Hotline 2',
    value: CONTACT.phone2,
    href: `tel:${CONTACT.phone2Raw}`,
  },
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
];

const addresses = ADDRESSES;

export function Footer() {
  return (
    <footer className="border-t border-glass-border bg-charcoal">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-charcoal font-heading font-bold text-xl">L</span>
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-cream">Lumi Design</h3>
                <p className="text-xs text-muted-foreground">Nội thất cao cấp • Bespoke</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Lumi Design chuyên thiết kế và thi công nội thất cao cấp cho căn hộ chung cư,
              biệt thự và nhà phố. Mang đến không gian sống tinh bản, đẳng cấp.
            </p>
            <div className="flex gap-3">
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-glass-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-glass-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all"
              >
                <Play className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-cream mb-6">Liên hệ</h4>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-cream transition-colors group"
                >
                  <span className="h-8 w-8 rounded-lg bg-glass-bg flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                    <info.icon className="h-4 w-4 text-gold" />
                  </span>
                  <span>{info.value}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-cream mb-6">Địa chỉ</h4>
            <div className="space-y-3">
              {addresses.map((addr, i) => (
                <div key={i} className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">{addr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-glass-border">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Lumi Design. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-cream transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-cream transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
