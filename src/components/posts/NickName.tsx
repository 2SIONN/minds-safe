interface NickNameProps {
  nickname: string
}

export default function NickName({ nickname }: NickNameProps) {
  return <div className="text-sm text-muted-foreground font-medium">{nickname}</div>
}
