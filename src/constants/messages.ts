export const MESSAGES = {
  /** 성공(Success) */
  SUCCESS: {
    POST_CREATED: '등록되었습니다.',
    COMMENT_CREATED: '댓글이 등록되었습니다.',
    NICKNAME_CHANGED: '닉네임이 변경되었습니다.',
    LIKE_ADDED: '공감했습니다.',
    LIKE_REMOVED: '공감을 취소했습니다.',
  },

  /** 안내(Info) */
  INFO: {
    EMPTY_NICKNAME: '닉네임을 비워두면 ‘익명’으로 표시됩니다.',
    EMPTY_STATE: '아직 등록된 고민이 없어요.',
    FILTER_EMPTY: '조건에 맞는 고민이 없어요.',
    DUPLICATE_LIKE: '이미 공감했습니다.',
  },

  /** 오류(Error) */
  ERROR: {
    AUTH_FAILED: '이메일 또는 비밀번호가 올바르지 않습니다.',
    AUTH_REQUIRED: '로그인이 필요합니다.',
    VALIDATION: '입력 형식을 확인하세요.',
    PERMISSION_DENIED: '작성자만 삭제할 수 있습니다.',
    NOT_FOUND: '존재하지 않는 리소스입니다.',
  },
} as const
