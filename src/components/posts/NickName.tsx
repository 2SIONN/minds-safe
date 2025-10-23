type NickNameProps = {
  nickname: string
}

export default function NickName({ nickname }: NickNameProps) {
  return <div>{nickname}</div>
}
