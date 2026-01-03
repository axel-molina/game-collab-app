import {
  Share2,
  Link,
  Facebook,
  Linkedin,
  MessageCircle,
  Twitter,
} from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ShareProjectProps {
  projectName: string;
}

export function ShareProject({ projectName }: ShareProjectProps) {
  const { t } = useTranslation();
  const shareUrl = window.location.href;
  const shareTitle = t("projects.share_text", { projectName });

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      Component: WhatsappShareButton,
      props: { title: shareTitle },
      color: "hover:text-[#25D366]",
    },
    {
      name: "X (Twitter)",
      icon: <Twitter className="h-4 w-4" />,
      Component: TwitterShareButton,
      props: { title: shareTitle },
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      Component: FacebookShareButton,
      props: { hashtag: shareUrl, quote: shareTitle },
      color: "hover:text-[#4267B2]",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      Component: LinkedinShareButton,
      props: { title: shareTitle },
      color: "hover:text-[#0077B5]",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success(t("projects.link_copied"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 px-3 sm:px-4">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t("projects.share")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareLinks.map((link) => (
          <DropdownMenuItem key={link.name} asChild>
            <link.Component
              url={shareUrl}
              {...link.props}
              className={`flex items-center gap-2 ml-2 cursor-pointer transition-colors w-full px-2 py-1.5 text-sm outline-none ${link.color}`}
            >
              {link.icon}
              {link.name}
            </link.Component>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={copyToClipboard}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Link className="h-4 w-4" />
          {t("projects.copy_link")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
