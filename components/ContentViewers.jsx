import { FileText, ExternalLink, Image } from "lucide-react";

export function PdfViewer({ url, title }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-8 text-center">
      <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
        <FileText className="w-7 h-7 text-white/40" />
      </div>
      <h3 className="font-sora font-medium text-white/70 mb-2">{title}</h3>
      <p className="text-xs font-space text-white/30 mb-6">PDF Document</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex px-6 py-3 bg-white/[0.06] border border-white/[0.08] text-sm font-space text-white/60 rounded-lg hover:bg-white/[0.1] transition-all"
      >
        Open PDF
      </a>
    </div>
  );
}

export function ImageViewer({ url, title }) {
  return (
    <div className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06]">
      <img src={url} alt={title} className="w-full object-contain max-h-[600px]" />
      <div className="px-5 py-3 border-t border-white/[0.04] flex items-center gap-2">
        <Image className="w-3.5 h-3.5 text-white/25" />
        <span className="text-xs font-space text-white/40">{title}</span>
      </div>
    </div>
  );
}

export function LinkEmbed({ url, title }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-8 text-center">
      <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
        <ExternalLink className="w-7 h-7 text-white/40" />
      </div>
      <h3 className="font-sora font-medium text-white/70 mb-2">{title}</h3>
      <p className="text-xs font-space text-white/30 mb-6">External Resource</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex px-6 py-3 bg-white/[0.06] border border-white/[0.08] text-sm font-space text-white/60 rounded-lg hover:bg-white/[0.1] transition-all items-center gap-2"
      >
        Open Link
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}