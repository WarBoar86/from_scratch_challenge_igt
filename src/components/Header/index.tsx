import Link from "next/link";

import  styles from "./header.module.scss";

export default function Header() {
  // TODO

  return(
    <div className={styles.header}>
      <div className={styles.container}> 
        <Link href="/" >
          <a>
            <img src="/logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </div>
  );

}
