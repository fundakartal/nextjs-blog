import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import SyntaxHighlighter from 'react-syntax-highlighter'
import Button from '../../components/button'
import Link from 'next/link'

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.mdx', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.mdx'),
    'utf-8'
  )

  const { data: frontMatter, content } = matter(markdownWithMeta)
  const mdxSource = await serialize(content)

  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
    },
  }
}

const PostPage = ({ frontMatter, mdxSource }) => {
  const { title, description, tags } = frontMatter
  return (
    <div className='container-2xl mt-4'>
      <article className='space-y-6'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        <p>{description}</p>
        <p>
          {tags.map((tag) => (
            <Link href={`/blog?tag=${tag.toLowerCase()}`} key={tag}>
              <a className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'>
                {tag}
              </a>
            </Link>
          ))}
        </p>
        <hr />
        <div className='prose'>
          <MDXRemote
            {...mdxSource}
            components={{ Button, SyntaxHighlighter }}
          />
        </div>
      </article>
    </div>
  )
}

export default PostPage
