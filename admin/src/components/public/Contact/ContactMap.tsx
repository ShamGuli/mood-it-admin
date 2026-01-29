interface Props {
  embedUrl?: string;
}

export default function ContactMap({ embedUrl }: Props) {
  const defaultMapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.4961855681636!2d14.017730776603916!3d48.16255465224958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4773995b0d8c8b8f%3A0x5a9c8b8b8b8b8b8b!2sWels%2C%20Austria!5e0!3m2!1sen!2saz!4v1706000000000!5m2!1sen!2saz';

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="google-map-iframe wow fadeInUp">
          <iframe
            src={embedUrl || defaultMapUrl}
            width="600"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mood IT Xəritə"
          />
        </div>
      </div>
    </div>
  );
}
