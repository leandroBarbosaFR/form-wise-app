// import { X } from "lucide-react";

export default function Banner() {
  return (
    <div className="flex items-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-sm/6 text-white">
        <a href="#">
          <strong className="font-semibold">Formwise</strong>
          <svg
            viewBox="0 0 2 2"
            aria-hidden="true"
            className="mx-2 inline size-0.5 fill-current"
          >
            <circle r={1} cx={1} cy={1} />
          </svg>
          Disponible prochainement&nbsp;
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
      <div className="flex flex-1 justify-end">
        {/* <button
          type="button"
          className="-m-3 p-3 focus-visible:-outline-offset-4"
        >
          <span className="sr-only">Dismiss</span>
          <X aria-hidden="true" className="size-5 text-white" />
        </button> */}
      </div>
    </div>
  );
}
