"use client";

import { ReactNode, useEffect, useState } from "react";

import { redirect, useParams, usePathname } from "next/navigation";

import { isUrlMissingLocale } from "@/utils/i18n";
import Loading from "@/components/Loading";
import { getLocaleByIP } from "@/utils/getLocale";

type LocaleProviderProps = {
  children: ReactNode;
};

const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [redirectPath, setRedirectPath] = useState("");
  const { lang: locale } = useParams();

  useEffect(() => {
    const check = async () => {
      let langCode = sessionStorage.getItem("detect_locale");
      const fromStorage = !!langCode;

      if (!langCode) {
        langCode = await getLocaleByIP();

        sessionStorage.setItem("detect_locale", langCode);
      }

      if (!fromStorage && langCode !== locale) {
        const path = isUrlMissingLocale(pathname) ? `/${langCode}${pathname}` : `/${langCode}${pathname.slice(3)}`

        setRedirectPath(path);
      }

      setIsChecking(false);
    };

    check();
  }, [locale, pathname]);

  if (isChecking) {
    return <Loading />;
  }

  if (redirectPath) {
    return redirect(redirectPath);
  }

  return <>{children}</>;
};

export default LocaleProvider;
