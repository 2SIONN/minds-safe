export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },

  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
  },

  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
  },

  replies: {
    all: ['replies'] as const,
    lists: () => [...queryKeys.replies.all, 'list'] as const,
    list: (postId: string) => [...queryKeys.replies.lists(), { postId }] as const,
  },

  empathies: {
    all: ['empathies'] as const,
  },
} as const
