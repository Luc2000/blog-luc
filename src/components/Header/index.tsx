import { Content } from "../../styles/styles.global";
import Link from "next/link";

export default function Header() {
  return(
    <Content>
      <Link href="/">
        <img src="/images/logo.png" alt="logo" />
      </Link>
    </Content>
  );
}
