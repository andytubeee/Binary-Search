import Head from 'next/head';
import React from 'react';

export default function secretTosPage() {
  return (
    <div>
      <Head>
        <title>Binary Search - Terms and Conditions</title>
      </Head>
      <div className='px-4 pb-4'>
        <h1 className='font-bold text-3xl my-3'>Our Terms and Conditions</h1>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id
              nisl id tortor gravida posuere. Nam in augue vel libero consequat
              porttitor. Mauris ut porttitor elit, eget finibus erat. Ut sit
              amet metus id ipsum porta interdum id in neque. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Nam at justo ut est egestas
              sagittis placerat et dui. Vivamus facilisis, erat eget tempus
              dictum, nibh turpis rhoncus est, et cursus tortor velit a quam.
              Nullam sed tortor ac elit facilisis elementum eu eu odio. Maecenas
              pellentesque dictum aliquam. Nullam euismod arcu sit amet mauris
              gravida, nec consectetur turpis pharetra. <br /> <br />
              Donec nec nibh at libero elementum gravida. Proin interdum
              sollicitudin hendrerit. Praesent mollis enim dolor, quis fermentum
              sem consectetur quis. Maecenas dignissim quam tellus, ac pretium
              massa finibus quis. Sed quam sem, placerat nec mi in, pretium
              euismod mauris. Nam et eros eget lectus tempor pellentesque nec
              sit amet nunc. Pellentesque sollicitudin odio ac neque blandit
              dignissim. Nulla fermentum lacus a nunc iaculis, a finibus velit
              condimentum. Vestibulum iaculis condimentum tellus. Vestibulum sem
              arcu, fermentum quis eleifend ac, porta et nunc. <br /> <br />{' '}
              Fusce tempus ligula ut dictum porttitor. Nunc elementum pulvinar
              mi, in convallis magna imperdiet eget. Vivamus dictum vitae tortor
              in bibendum. Aliquam dignissim odio elit. Quisque id libero
              sodales, consectetur enim et, pharetra lacus. Pellentesque vel
              auctor augue, et hendrerit purus. Nulla porta, nisl in rutrum
              consequat, sem ipsum viverra velit, non sollicitudin justo velit
              et massa.
              <br /> <br /> Suspendisse vitae mauris nec velit pulvinar
              pellentesque. Interdum et malesuada fames ac ante ipsum primis in
              faucibus. Donec vehicula, eros sit amet volutpat vulputate, tellus
              justo bibendum ligula, in condimentum nunc neque id justo. Proin
              vel leo vitae leo luctus aliquam. Curabitur luctus eget odio vitae
              egestas. Suspendisse aliquet nibh sapien, a egestas diam varius
              sit amet. Vestibulum nec elit porttitor, varius libero quis,
              ultricies sapien. Etiam ac justo felis. Vivamus mollis tincidunt
              turpis a rhoncus. <br /> <br /> Curabitur imperdiet ex ut justo
              tristique, quis mollis purus sagittis. Fusce rutrum diam ut
              sollicitudin viverra. Curabitur quam lectus, interdum in arcu
              tristique, porta blandit sem. Vivamus ex turpis, mollis ac nibh
              ut, auctor dictum orci. Aenean in scelerisque libero, et mattis
              mauris. Aliquam ornare tincidunt placerat. Vivamus scelerisque
              pulvinar est sed aliquet. Morbi ullamcorper, libero sed sagittis
              vehicula, sem purus scelerisque diam, non aliquet dolor sapien a
              neque. Vestibulum suscipit, ligula non iaculis luctus, felis lacus
              ultrices libero, nec lacinia ante arcu rhoncus odio. Maecenas sit
              amet nunc eget risus cursus eleifend. <br /> <br /> Ut in
              convallis lectus, ac faucibus turpis. Nulla lobortis pharetra
              turpis, non posuere tellus euismod ut. Ut feugiat felis massa, nec
              semper orci pulvinar sit amet. Etiam nec gravida ligula. Nunc
              ipsum libero, dictum sed massa ut, tristique ullamcorper ligula.
              Vivamus eget varius purus, nec pulvinar turpis. Mauris libero
              elit, ullamcorper nec placerat ut, iaculis porttitor nulla. Nam
              sit amet lorem ornare, facilisis dolor quis, ultricies arcu. Nulla
              ipsum odio, porta eget urna convallis, tristique vehicula eros.
              Nunc finibus sem tellus, non ullamcorper nisl viverra non. Aliquam
              fringilla, risus a vulputate porttitor, mauris massa pulvinar
              purus, eget sagittis quam diam a sapien. Quisque at urna vitae
              justo tincidunt consectetur.
            </p>
          ))}
        <br /> <p>We will sell all of your data</p>
      </div>
    </div>
  );
}
