import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';

import { Container, Content, AnimationContainer } from './styles';
import { useAuth } from '../../hooks/auth';

interface FormData {
  category_id: string;
  // instructor_id: string;
  platform_id: string;
  name: string;
  about: string;
  workload: string;
  time_type: string;
  certification: string;
  level: string;
  url: string;
  video: string;
  name_instructor: string;
  pricing: string;
  active?: boolean;
}

interface CategoryDTO {
  id: string;
  name: string;
}

interface InstructorDTO {
  id: string;
  name: string;
}

const CourseSuggestion: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user } = useAuth();

  const [categories, setCategories] = useState<CategoryDTO[]>();
  // const [instructors, setInstructors] = useState<InstructorDTO[]>();
  const [platforms, setPlatforms] = useState<InstructorDTO[]>();

  useEffect(() => {
    api.get(`/categories`).then((response) => {
      setCategories(response.data);
    });
    // api.get(`/instructors`).then((response) => {
    //   setInstructors(response.data);
    // });
    api.get(`/platforms`).then((response) => {
      setPlatforms(response.data);
    });
  }, []);

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigat??rio'),
          about: Yup.string().required('Descri????o ?? obrigat??ria'),
          workload: Yup.string().required('Carga horaria ?? obrigat??ria'),
          url: Yup.string().required('Carga horaria ?? obrigat??ria'),
          video: Yup.string(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          category_id,
          // instructor_id,
          platform_id,
          name,
          about,
          workload,
          time_type,
          certification,
          pricing,
          url,
          level,
          video,
          name_instructor,
        } = data;

        const formData = {
          category_id,
          // instructor_id,
          platform_id,
          name,
          about,
          workload: `${workload} ${time_type}`,
          pricing,
          certification,
          level,
          url,
          video,
          name_instructor,
          ...(user.admin
            ? {
                active: true,
              }
            : {}),
        };

        await api.post('courses', formData);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cursos cadastrado com sucesso!',
          description:
            'Obrigado por contribuir, curso cadastrado aguardando aprova????o de um administrador!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        } else {
          addToast({
            type: 'error',
            title: 'Erro no cadastro',
            description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
          });
        }
      }
    },
    [addToast, history, user],
  );

  return (
    <Container>
      <Header />
      <Content>
        <AnimationContainer>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Adicione o curso desejado</h1>
            <h3>Contribuia compartilhando cursos que voc?? gostou ????</h3>
            <hr />
            <Input name="name" type="text" placeholder="Nome do curso" />
            <Textarea placeholder="Descri????o do curso" name="about" />
            <Input
              name="url"
              type="text"
              placeholder="Endere??o do curso (site)"
            />
            <Input
              name="video"
              type="text"
              placeholder="V??deo de apresenta????o do curso"
            />
            <hr />
            <div className="row input-select">
              <Input name="workload" type="text" placeholder="Carga hor??ria" />
              <Select name="time_type">
                <option>Hora(s)</option>
                <option>Minuto(s)</option>
              </Select>
            </div>
            <div className="row">
              <Select label="Precifica????o" name="pricing">
                <option>Gr??tis</option>
                <option>Pago</option>
                <option>Assinatura da plataforma</option>
              </Select>
              <Select label="Certicica????o v??lida" name="certification">
                <option>Com certifi????o</option>
                <option>Sem certifica????o</option>
              </Select>
            </div>
            <div className="row">
              <Select label="N??vel de conhecimento desejavel" name="level">
                <option>B??sico</option>
                <option>Intermedi??rio</option>
                <option>Avan??ado</option>
              </Select>
              <Select label="Categoria" name="category_id">
                {categories?.map((option1) => (
                  <option key={option1.id} value={option1.id}>
                    {option1.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="row">
              {/* <Select label="Instrutor" name="instructor_id">
                {instructors?.map((option2) => (
                  <option key={option2.id} value={option2.id}>
                    {option2.name}
                  </option>
                ))}
              </Select> */}
              <Input
                label="Instrutor"
                name="name_instructor"
                type="text"
                placeholder="Instrutor"
              />
              <Select label="Plataforma" name="platform_id">
                {platforms?.map((option3) => (
                  <option key={option3.id} value={option3.id}>
                    {option3.name}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit">Cadastrar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Footer />
    </Container>
  );
};

export default CourseSuggestion;
