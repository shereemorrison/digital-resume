import styles from "./SitePreviewCard.module.css";

type Props = {
  title: string;
  url: string;
  image: string;
  description?: string;
};

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SitePreviewCard({ title, url, image, description }: Props) {
  return (
    <article className={styles.card}>
      <a className={styles.cardLink} href={url} target="_blank" rel="noreferrer">
        <div className={styles.chrome}>
          <span className={styles.dots} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.url}>{hostname(url)}</span>
          <span className={styles.openIcon} aria-hidden>
            ↗
          </span>
        </div>
        <div className={styles.viewport}>
          <img
            className={styles.previewImg}
            src={image}
            alt={`${title} preview`}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className={styles.meta}>
          <h3 className={styles.title}>{title}</h3>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
      </a>
    </article>
  );
}
