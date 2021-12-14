import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { AiOutlineCalendar, AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';

import { getPrismicClient } from '../../services/prismic';

import { Content } from '../../styles/styles.global';
import { PostContent } from './styles.post';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}:PostProps) {
  const router = useRouter();

  if(router.isFallback){
    return (
      <>
       <PostContent>
          <Content><h3><b>Carregando...</b></h3></Content>
        </PostContent>
      </>
    )
  }

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(' ').length;

    const words = contentItem.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));

    return total;
  }, 0);

  const readTime = Math.ceil(totalWords / 200);

  return(
    <>
      <Head>
        <title>{post.data.title} | BenioBlog</title>
      </Head>
      <PostContent>
        <img src={post.data.banner.url} alt='imagem' className='banner' />
        <Content>
            <h1>{post.data.title}</h1>
            <div className="info">
              <div>
                <AiOutlineCalendar />
                <p>
                  {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                    locale:ptBR
                  })}
                </p>
              </div>
              <div>
                <AiOutlineUser />
                <p>{post.data.author}</p>
              </div>
              <div>
                <AiOutlineClockCircle />
                <p>{`${readTime} min`}</p>
              </div>
            </div>
            <div className='postContent'>
              {post.data.content.map(postHtml => (
                <article key={postHtml.heading}>
                  <h2 className="heading"><b>{postHtml.heading}</b></h2>
                  <div dangerouslySetInnerHTML={{__html: RichText.asHtml(postHtml.body)}} />
                </article>
              ))}
            </div>
        </Content>
      </PostContent>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref || null,
  });

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
      navigation: {
        prevPost: prevPost?.results,
        nextPost: nextPost?.results,
      },
      preview,
    },
    revalidate: 1800,
  };
};