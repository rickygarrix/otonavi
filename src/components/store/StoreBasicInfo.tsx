"use client"

import type { HomeStore } from "@/types/store"
import {
  FaInstagram,
  FaFacebook,
  FaLink,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { SiTiktok } from "react-icons/si"

type Props = {
  store: HomeStore
}

export default function StoreBasicInfo({ store }: Props) {
  return (
    <div className="px-4 py-5">
      <p className="text-sm text-slate-600">
        {store.prefecture_label} {store.area_label} {store.type_label}
      </p>

      <h1 className="text-2xl font-extrabold mt-1">{store.name}</h1>

      {store.description && (
        <p className="mt-4 whitespace-pre-line text-slate-700">
          {store.description}
        </p>
      )}

      {/* SNS */}
      <div className="flex gap-5 mt-6 items-center">
        {store.instagram_url && (
          <SNSLink href={store.instagram_url}>
            <FaInstagram />
          </SNSLink>
        )}

        {store.x_url && (
          <SNSLink href={store.x_url}>
            <FaXTwitter />
          </SNSLink>
        )}

        {store.facebook_url && (
          <SNSLink href={store.facebook_url}>
            <FaFacebook />
          </SNSLink>
        )}

        {store.tiktok_url && (
          <SNSLink href={store.tiktok_url}>
            <SiTiktok />
          </SNSLink>
        )}

        {store.official_site_url && (
          <SNSLink href={store.official_site_url}>
            <FaLink />
          </SNSLink>
        )}
      </div>
    </div>
  )
}

function SNSLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        text-slate-600
        hover:text-slate-900
        transition
        text-[26px]
        hover:scale-110
      "
    >
      {children}
    </a>
  )
}