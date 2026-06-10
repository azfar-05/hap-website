"use client";

import Image from "next/image";
import { useState } from "react";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Image>;

export default function FadingImage({ className = "", ...props }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      className={`img-fade${loaded ? " loaded" : ""} ${className}`.trim()}
      onLoad={() => setLoaded(true)}
    />
  );
}
